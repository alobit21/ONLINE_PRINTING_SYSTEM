import graphene
import stationary_accounts.schema
import stationary_shops.schema
import stationary_storage.schema
import stationary_orders.schema
import stationary_core.schema

class Query(stationary_accounts.schema.Query, stationary_shops.schema.Query, 
            stationary_storage.schema.Query, stationary_orders.schema.Query,
            stationary_core.schema.Query, graphene.ObjectType):
    # Aggregate other apps here later
    pass

class Mutation(stationary_accounts.schema.Mutation, stationary_shops.schema.Mutation,
               stationary_storage.schema.Mutation, stationary_orders.schema.Mutation, graphene.ObjectType):
    # Aggregate other recipes here later
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
