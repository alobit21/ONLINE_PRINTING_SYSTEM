from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from stationary_shops.models import Shop, ShopPricing, ServiceType, PageRangeDiscount
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with sample shops in Dodoma, Tanzania context'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=15,
            help='Number of shops to create (default: 15)'
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

        # Dodoma, Tanzania coordinates
        DODOMA_LAT = -6.1731
        DODOMA_LON = 35.7419

        # Sample shop data for Dodoma
        shop_templates = [
            {
                'name': 'Dodoma Capital Printers',
                'description': 'Premium printing services in the heart of Dodoma',
                'address': 'Main Street, Central Business District, Dodoma',
                'latitude': -6.1750,
                'longitude': 35.7440,
            },
            {
                'name': 'UDOM Print Center',
                'description': 'Student-focused printing at University of Dodoma',
                'address': 'UDOM Campus, Chimwaga, Dodoma',
                'latitude': -6.1550,
                'longitude': 35.8050,
            },
            {
                'name': 'Area D Quick Copy',
                'description': 'Fast and reliable Xerox and binding',
                'address': 'Area D Residential, Dodoma',
                'latitude': -6.1600,
                'longitude': 35.7550,
            },
            {
                'name': 'Nzuguni Digital Prints',
                'description': 'High-quality digital printing and scanning',
                'address': 'Nzuguni Area, Dodoma',
                'latitude': -6.1950,
                'longitude': 35.7850,
            },
            {
                'name': 'Kikuyu Printing Solutions',
                'description': 'All types of corporate and local printing',
                'address': 'Kikuyu North, Dodoma',
                'latitude': -6.1850,
                'longitude': 35.7350,
            },
            {
                'name': 'Area C Stationery & Print',
                'description': 'Reliable printing and stationery supply',
                'address': 'Area C, Dodoma',
                'latitude': -6.1680,
                'longitude': 35.7680,
            },
            {
                'name': 'Bihawana Copy Shop',
                'description': 'Community printing services',
                'address': 'Bihawana Road, Dodoma',
                'latitude': -6.2100,
                'longitude': 35.7100,
            },
            {
                'name': 'Mtendeni Digital Hub',
                'description': 'Modern printing and internet services',
                'address': 'Mtendeni Street, Dodoma',
                'latitude': -6.1720,
                'longitude': 35.7420,
            },
            {
                'name': 'Ipagala Print Express',
                'description': 'Speedy printing for everyone',
                'address': 'Ipagala South, Dodoma',
                'latitude': -6.1900,
                'longitude': 35.7600,
            },
            {
                'name': 'Chang\'ombe Creative Prints',
                'description': 'Creative design and large scale printing',
                'address': 'Chang\'ombe Area, Dodoma',
                'latitude': -6.1500,
                'longitude': 35.7300,
            },
        ]

        # Create or get shop owner users
        shop_owners = []
        for i in range(10):
            email = f'dodoma_owner{i+1}@printsync.tz'
            owner, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'role': User.Role.SHOP_OWNER,
                    'is_verified': True,
                }
            )
            if created:
                owner.set_password('dodoma123')
                owner.save()
                self.stdout.write(self.style.SUCCESS(f'Created Dodoma shop owner: {email}'))
            shop_owners.append(owner)

        created_count = 0
        for i in range(count):
            template_idx = i % len(shop_templates)
            template = shop_templates[template_idx].copy()
            
            if i >= len(shop_templates):
                # Add some randomness for more shops
                template['name'] = f"{template['name']} {random.randint(2, 5)}"
                template['latitude'] += random.uniform(-0.02, 0.02)
                template['longitude'] += random.uniform(-0.02, 0.02)
                template['address'] = f"{template['address']} (Branch {random.randint(2, 5)})"

            subscription_tiers = [Shop.Subscription.STARTER, Shop.Subscription.PRO, Shop.Subscription.BUSINESS]
            
            shop = Shop.objects.create(
                owner=random.choice(shop_owners),
                name=template['name'],
                description=template['description'],
                address=template['address'],
                latitude=template['latitude'],
                longitude=template['longitude'],
                is_verified=True,
                is_accepting_orders=True,
                subscription_tier=random.choice(subscription_tiers),
                rating=Decimal(str(round(random.uniform(4.0, 5.0), 2))),
                queue_capacity=random.randint(10, 30),
            )

            self._create_pricing_rules(shop)
            self._create_page_discounts(shop)

            created_count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Created Dodoma shop: {shop.name} at {shop.latitude}, {shop.longitude}')
            )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully seeded {created_count} shops in Dodoma context!')
        )

    def _create_pricing_rules(self, shop):
        # Pricing in local context (Tsh equivalent represented in Decimal)
        # Using smaller decimals for base prices (e.g., 100 Tsh -> 0.10)
        pricing_data = [
            {
                'service_type': ServiceType.PRINTING_BW,
                'base_price': Decimal('0.10'),
                'modifiers': {'A4': 1.0, 'A3': 2.0}
            },
            {
                'service_type': ServiceType.PRINTING_COLOR,
                'base_price': Decimal('0.50'),
                'modifiers': {'A4': 1.0, 'A3': 2.0}
            },
            {
                'service_type': ServiceType.BINDING,
                'base_price': Decimal('1.50'),
                'modifiers': {'HardCover': 2.0, 'Spiral': 1.0}
            },
            {
                'service_type': ServiceType.LAMINATION,
                'base_price': Decimal('1.00'),
                'modifiers': {'A4': 1.0, 'A3': 2.5}
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
        if shop.subscription_tier in [Shop.Subscription.PRO, Shop.Subscription.BUSINESS]:
            discount_ranges = [
                {'min_pages': 20, 'max_pages': 49, 'discount_percent': Decimal('5.00')},
                {'min_pages': 50, 'max_pages': 99, 'discount_percent': Decimal('10.00')},
                {'min_pages': 100, 'max_pages': None, 'discount_percent': Decimal('20.00')},
            ]
            for dr in discount_ranges:
                PageRangeDiscount.objects.create(
                    shop=shop,
                    min_pages=dr['min_pages'],
                    max_pages=dr['max_pages'],
                    discount_percent=dr['discount_percent']
                )
