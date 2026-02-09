from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from stationary_shops.models import Shop, ShopPricing, ServiceType, PageRangeDiscount
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with sample shops and their pricing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=20,
            help='Number of shops to create (default: 20)'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing shops before seeding'
        )

    def handle(self, *args, **options):
        count = options['count']
        clear = options['clear']

        if clear:
            self.stdout.write(self.style.WARNING('Clearing existing shops...'))
            Shop.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Existing shops cleared.'))

        # Sample shop data with realistic locations (London area)
        shop_templates = [
            {
                'name': 'PrintHub Central',
                'description': 'Your one-stop printing solution in the heart of the city',
                'address': '123 Oxford Street, London, W1D 2HG',
                'latitude': 51.5154,
                'longitude': -0.1419,
            },
            {
                'name': 'QuickPrint Express',
                'description': 'Fast and reliable printing services',
                'address': '45 King\'s Road, Chelsea, London, SW3 4UD',
                'latitude': 51.4875,
                'longitude': -0.1687,
            },
            {
                'name': 'Campus Copy Center',
                'description': 'Student-friendly printing at affordable prices',
                'address': '78 Gower Street, Bloomsbury, London, WC1E 6HJ',
                'latitude': 51.5246,
                'longitude': -0.1340,
            },
            {
                'name': 'Elite Stationery',
                'description': 'Premium printing and binding services',
                'address': '92 Piccadilly, Mayfair, London, W1J 8DY',
                'latitude': 51.5074,
                'longitude': -0.1419,
            },
            {
                'name': 'City Print Central',
                'description': 'Professional printing for businesses',
                'address': '156 Fleet Street, City of London, EC4A 2DY',
                'latitude': 51.5142,
                'longitude': -0.1054,
            },
            {
                'name': 'Main Street Prints',
                'description': 'Community printing services',
                'address': '234 High Street, Kensington, London, W8 4PH',
                'latitude': 51.4991,
                'longitude': -0.1938,
            },
            {
                'name': 'Digital Print Solutions',
                'description': 'Modern printing technology',
                'address': '67 Shoreditch High Street, London, E1 6JJ',
                'latitude': 51.5255,
                'longitude': -0.0754,
            },
            {
                'name': 'The Print Shop',
                'description': 'Traditional quality meets modern service',
                'address': '89 Camden High Street, London, NW1 7JY',
                'latitude': 51.5392,
                'longitude': -0.1426,
            },
            {
                'name': 'Speedy Prints',
                'description': 'Same-day printing guaranteed',
                'address': '145 Tottenham Court Road, London, W1T 7NE',
                'latitude': 51.5200,
                'longitude': -0.1357,
            },
            {
                'name': 'Office Print Hub',
                'description': 'Corporate printing specialists',
                'address': '201 Canary Wharf, London, E14 5AB',
                'latitude': 51.5054,
                'longitude': -0.0235,
            },
        ]

        # Additional location variations for more shops
        location_variations = [
            {'lat_offset': 0.01, 'lon_offset': 0.01, 'area': 'North'},
            {'lat_offset': -0.01, 'lon_offset': 0.01, 'area': 'South'},
            {'lat_offset': 0.01, 'lon_offset': -0.01, 'area': 'East'},
            {'lat_offset': -0.01, 'lon_offset': -0.01, 'area': 'West'},
            {'lat_offset': 0.02, 'lon_offset': 0, 'area': 'Central'},
            {'lat_offset': 0, 'lon_offset': 0.02, 'area': 'Downtown'},
            {'lat_offset': -0.02, 'lon_offset': 0, 'area': 'Uptown'},
            {'lat_offset': 0, 'lon_offset': -0.02, 'area': 'Riverside'},
            {'lat_offset': 0.015, 'lon_offset': 0.015, 'area': 'Heights'},
            {'lat_offset': -0.015, 'lon_offset': -0.015, 'area': 'Gardens'},
        ]

        # Create or get shop owner users
        shop_owners = []
        for i in range(min(count, 10)):
            email = f'shopowner{i+1}@printsync.com'
            owner, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'role': User.Role.SHOP_OWNER,
                    'is_verified': True,
                }
            )
            if created:
                owner.set_password('password123')
                owner.save()
                self.stdout.write(self.style.SUCCESS(f'Created shop owner: {email}'))
            shop_owners.append(owner)

        created_count = 0
        for i in range(count):
            # Select template and apply variation
            template_idx = i % len(shop_templates)
            template = shop_templates[template_idx].copy()
            
            if i >= len(shop_templates):
                # Apply variation for additional shops
                variation = location_variations[i % len(location_variations)]
                template['name'] = f"{variation['area']} {template['name']}"
                template['latitude'] += variation['lat_offset']
                template['longitude'] += variation['lon_offset']
                template['address'] = f"{template['address'].split(',')[0]}, {variation['area']} Area"

            # Random shop attributes
            subscription_tiers = [Shop.Subscription.STARTER, Shop.Subscription.PRO, Shop.Subscription.BUSINESS]
            
            shop = Shop.objects.create(
                owner=random.choice(shop_owners),
                name=template['name'],
                description=template['description'],
                address=template['address'],
                latitude=template['latitude'],
                longitude=template['longitude'],
                is_verified=random.choice([True, True, True, False]),  # 75% verified
                is_accepting_orders=random.choice([True, True, True, True, False]),  # 80% accepting
                subscription_tier=random.choice(subscription_tiers),
                rating=Decimal(str(round(random.uniform(3.5, 5.0), 2))),
                queue_capacity=random.randint(5, 20),
            )

            # Create pricing rules for each shop
            self._create_pricing_rules(shop)
            
            # Create page range discounts
            self._create_page_discounts(shop)

            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Created shop: {shop.name} (Rating: {shop.rating})')
            )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully seeded {created_count} shops!')
        )

    def _create_pricing_rules(self, shop):
        """Create pricing rules for a shop"""
        # Base prices vary by shop tier
        tier_multipliers = {
            Shop.Subscription.STARTER: 1.0,
            Shop.Subscription.PRO: 0.9,
            Shop.Subscription.BUSINESS: 0.85,
        }
        multiplier = tier_multipliers.get(shop.subscription_tier, 1.0)

        pricing_data = [
            {
                'service_type': ServiceType.PRINTING_BW,
                'base_price': Decimal(str(round(0.10 * multiplier, 2))),
                'modifiers': {
                    'A4': 1.0,
                    'A3': 1.5,
                    'Letter': 1.0,
                    'Legal': 1.2,
                }
            },
            {
                'service_type': ServiceType.PRINTING_COLOR,
                'base_price': Decimal(str(round(0.50 * multiplier, 2))),
                'modifiers': {
                    'A4': 1.0,
                    'A3': 1.8,
                    'Letter': 1.0,
                    'Legal': 1.3,
                }
            },
            {
                'service_type': ServiceType.BINDING,
                'base_price': Decimal(str(round(2.00 * multiplier, 2))),
                'modifiers': {}
            },
            {
                'service_type': ServiceType.LAMINATION,
                'base_price': Decimal(str(round(1.00 * multiplier, 2))),
                'modifiers': {
                    'A4': 1.0,
                    'A3': 1.5,
                }
            },
        ]

        for pricing in pricing_data:
            ShopPricing.objects.create(
                shop=shop,
                service_type=pricing['service_type'],
                base_price=pricing['base_price'],
                modifiers=pricing['modifiers']
            )

    def _create_page_discounts(self, shop):
        """Create page range discounts for a shop"""
        # Only create discounts for PRO and BUSINESS tier shops
        if shop.subscription_tier in [Shop.Subscription.PRO, Shop.Subscription.BUSINESS]:
            discount_ranges = [
                {'min_pages': 50, 'max_pages': 99, 'discount_percent': Decimal('5.00')},
                {'min_pages': 100, 'max_pages': 199, 'discount_percent': Decimal('10.00')},
                {'min_pages': 200, 'max_pages': None, 'discount_percent': Decimal('15.00')},
            ]

            for discount_range in discount_ranges:
                PageRangeDiscount.objects.create(
                    shop=shop,
                    min_pages=discount_range['min_pages'],
                    max_pages=discount_range['max_pages'],
                    discount_percent=discount_range['discount_percent']
                )
