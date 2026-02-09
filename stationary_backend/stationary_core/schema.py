import graphene
from stationary_accounts.models import User
from stationary_shops.models import Shop
from stationary_orders.models import Order
from django.db.models import Sum
from tarxemo_django_graphene_utils import build_success_response, build_error, BaseResponseDTO

class AdminStatsDTO(graphene.ObjectType):
    total_users = graphene.Int()
    total_shops = graphene.Int()
    total_orders = graphene.Int()
    total_revenue = graphene.Float()
    pending_shops_count = graphene.Int()

class AdminStatsResponseDTO(BaseResponseDTO):
    data = graphene.Field(AdminStatsDTO)

class Query(graphene.ObjectType):
    admin_stats = graphene.Field(AdminStatsResponseDTO)

    def resolve_admin_stats(self, info):
        user = info.context.user
        if not user.is_authenticated or user.role != 'ADMIN':
            return AdminStatsResponseDTO(response=build_error("Admin access required"))
        
        total_users = User.objects.count()
        total_shops = Shop.objects.count()
        total_orders = Order.objects.count()
        total_revenue = Order.objects.filter(status='COMPLETED').aggregate(Sum('total_price'))['total_price__sum'] or 0.0
        pending_shops_count = Shop.objects.filter(is_verified=False).count()

        print(f"DEBUG: Admin Stats - Users: {total_users}, Shops: {total_shops}, Orders: {total_orders}, Pending: {pending_shops_count}")

        return AdminStatsResponseDTO(
            response=build_success_response(),
            data=AdminStatsDTO(
                total_users=total_users,
                total_shops=total_shops,
                total_orders=total_orders,
                total_revenue=float(total_revenue),
                pending_shops_count=pending_shops_count
            )
        )
