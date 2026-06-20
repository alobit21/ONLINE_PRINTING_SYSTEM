import os
import django
import sys

# Ensure Django is set up
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stationary_config.settings')
django.setup()

from stationary_accounts.models import User
from stationary_shops.models import Shop, ShopPricing, ServiceType

def run_seed():
    print("Seeding database...")

    # 1. Create an Admin user
    if not User.objects.filter(email='admin@tarxemo.com').exists():
        admin = User.objects.create_superuser(
            email='admin@tarxemo.com',
            password='adminpassword123',
            first_name='Admin',
            last_name='User'
        )
        print("Created Admin user: admin@tarxemo.com")
    else:
        admin = User.objects.get(email='admin@tarxemo.com')
        print("Admin user already exists.")

    # 2. Create Shop Owners
    shop_owners_data = [
        {'email': 'owner1@tarxemo.com', 'password': 'password123', 'first_name': 'John', 'last_name': 'Doe'},
        {'email': 'owner2@tarxemo.com', 'password': 'password123', 'first_name': 'Jane', 'last_name': 'Smith'},
    ]

    shop_owners = []
    for owner_data in shop_owners_data:
        owner, created = User.objects.get_or_create(
            email=owner_data['email'],
            defaults={
                'first_name': owner_data['first_name'],
                'last_name': owner_data['last_name'],
                'role': User.Role.SHOP_OWNER,
                'is_verified': True
            }
        )
        if created:
            owner.set_password(owner_data['password'])
            owner.save()
            print(f"Created Shop Owner: {owner.email}")
        else:
            print(f"Shop Owner {owner.email} already exists.")
        shop_owners.append(owner)

    # 3. Create Regular Users
    user, created = User.objects.get_or_create(
        email='customer@tarxemo.com',
        defaults={
            'first_name': 'Regular',
            'last_name': 'Customer',
            'role': User.Role.CUSTOMER,
            'is_verified': True
        }
    )
    if created:
        user.set_password('password123')
        user.save()
        print("Created Customer: customer@tarxemo.com")
    else:
        print("Customer already exists.")

    # 4. Create Shops
    # Coordinates centered roughly around Dodoma, Tanzania
    shops_data = [
        {
            'owner': shop_owners[0],
            'name': "Dodoma Print Masters",
            'description': "High quality enterprise printing solutions.",
            'address': "Plot 45, Nyerere Road, Dodoma",
            'latitude': -6.162959,
            'longitude': 35.751607,
            'subscription_tier': Shop.Subscription.PRO,
            'rating': 4.8,
            'is_verified': True,
        },
        {
            'owner': shop_owners[1],
            'name': "University Express Copiers",
            'description': "Fast and cheap printing for students.",
            'address': "UDOM Campus Area, Dodoma",
            'latitude': -6.183333,
            'longitude': 35.766667,
            'subscription_tier': Shop.Subscription.STARTER,
            'rating': 4.5,
            'is_verified': True,
        }
    ]

    for data in shops_data:
        shop, created = Shop.objects.get_or_create(
            name=data['name'],
            defaults=data
        )
        if created:
            print(f"Created Shop: {shop.name}")
            
            # 5. Create default pricing for each shop
            pricing_rules = [
                {'service_type': ServiceType.PRINTING_BW, 'base_price': 100.00},
                {'service_type': ServiceType.PRINTING_COLOR, 'base_price': 500.00},
                {'service_type': ServiceType.BINDING, 'base_price': 2000.00},
                {'service_type': ServiceType.LAMINATION, 'base_price': 1500.00},
            ]
            
            for rule in pricing_rules:
                ShopPricing.objects.create(
                    shop=shop,
                    service_type=rule['service_type'],
                    base_price=rule['base_price']
                )
            print(f"Created pricing rules for {shop.name}")
        else:
            print(f"Shop {shop.name} already exists.")

    print("\nDatabase successfully seeded!")

if __name__ == '__main__':
    run_seed()
