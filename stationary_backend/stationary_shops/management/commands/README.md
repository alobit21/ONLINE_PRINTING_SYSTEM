# Shop Seeding Management Command

## Overview
The `seed_shops` management command creates sample shop data for development and testing purposes.

## Usage

### Basic Usage
```bash
python manage.py seed_shops
```
This creates 20 shops with default settings.

### Options

#### `--count`
Specify the number of shops to create:
```bash
python manage.py seed_shops --count 50
```

#### `--clear`
Clear all existing shops before seeding:
```bash
python manage.py seed_shops --clear
```

### Combined Example
```bash
python manage.py seed_shops --count 30 --clear
```

## What Gets Created

### Shop Owners
- Automatically creates shop owner accounts (up to 10)
- Email format: `shopowner1@printsync.com`, `shopowner2@printsync.com`, etc.
- Default password: `password123`
- Role: `SHOP_OWNER`

### Shops
Each shop includes:
- **Name**: Realistic shop names (e.g., "PrintHub Central", "QuickPrint Express")
- **Location**: London-area coordinates (latitude/longitude)
- **Address**: Realistic London addresses
- **Rating**: Random rating between 3.5 and 5.0
- **Subscription Tier**: Random (STARTER, PRO, or BUSINESS)
- **Verification Status**: 75% verified
- **Accepting Orders**: 80% accepting orders
- **Queue Capacity**: Random between 5-20

### Pricing Rules
Each shop gets 4 pricing rules:
1. **Black & White Printing** (£0.10 base)
   - A4: 1.0x, A3: 1.5x, Letter: 1.0x, Legal: 1.2x
2. **Color Printing** (£0.50 base)
   - A4: 1.0x, A3: 1.8x, Letter: 1.0x, Legal: 1.3x
3. **Binding** (£2.00 base)
4. **Lamination** (£1.00 base)
   - A4: 1.0x, A3: 1.5x

*Note: Prices are adjusted based on subscription tier (PRO: -10%, BUSINESS: -15%)*

### Page Range Discounts
PRO and BUSINESS tier shops get volume discounts:
- 50-99 pages: 5% off
- 100-199 pages: 10% off
- 200+ pages: 15% off

## Sample Locations
The command seeds shops in various London areas:
- Oxford Street (Central)
- King's Road (Chelsea)
- Gower Street (Bloomsbury)
- Piccadilly (Mayfair)
- Fleet Street (City of London)
- High Street (Kensington)
- Shoreditch High Street
- Camden High Street
- Tottenham Court Road
- Canary Wharf

Additional shops are created with location variations (North, South, East, West, etc.)

## Development Tips

### Reset and Reseed
```bash
python manage.py seed_shops --clear --count 20
```

### Create Many Shops for Testing
```bash
python manage.py seed_shops --count 100
```

### Verify Seeded Data
```bash
python manage.py shell
>>> from stationary_shops.models import Shop
>>> Shop.objects.count()
>>> Shop.objects.values('name', 'rating', 'subscription_tier')
```

## Notes
- Shop owners are reused if they already exist
- Coordinates are realistic London locations
- Ratings and other attributes are randomized for variety
- All seeded data is suitable for development/testing only
