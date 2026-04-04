#!/usr/bin/env python3
"""
Debug ClickPesa API to see why SMS prompts are not being sent
"""
import os
import sys
import django
import requests
import json
import hashlib
import hmac

# Add backend directory to Python path
sys.path.append('/media/tarxemo/TarXemo/MAC/PROJECTS/PROJECTS/DJANGO/ONLINE_PRINTING_SYSTEM/stationary_backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stationary_config.settings')
django.setup()

from stationary_orders.models import Payment, Order, GuestCustomer
from stationary_orders.clickpesa_service import ClickPesaService
from stationary_shops.models import Shop
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

def test_clickpesa_api_directly():
    """Test ClickPesa API directly to see response"""
    print("🔍 Testing ClickPesa API Directly")
    print("=" * 60)
    
    # Test credentials from .env
    client_id = "ID0ubLc8rfWFrrkr3Tz0PigSMuYthyxK"
    api_key = "SKJ0lxbD1ePo8IDglXpnTBoioRFdytEjXw4bk2UJLT"
    secret_key = "abcd123"
    
    print(f"Client ID: {client_id}")
    print(f"API Key: {api_key[:10]}...")
    print(f"Secret Key: {secret_key}")
    
    # Test API endpoint
    base_url = "https://api.clickpesa.com/v1"
    endpoint = f"{base_url}/payments/mobile-money"
    
    # Test payload
    payload = {
        'amount': 5000.0,
        'currency': 'TZS',
        'payment_method': 'MPESA',
        'phone_number': '+255712345678',
        'reference': 'TEST-ORDER-123',
        'callback_url': 'http://localhost:8000/api/payments/webhook/clickpesa/',
        'description': 'Test payment for debugging',
    }
    
    # Generate checksum
    payload_str = json.dumps(payload, sort_keys=True, separators=(',', ':'))
    checksum = hmac.new(
        secret_key.encode('utf-8'),
        payload_str.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
        'X-Client-Id': client_id,
        'X-Checksum': checksum,
    }
    
    print(f"\n📤 Sending request to: {endpoint}")
    print(f"📋 Payload: {json.dumps(payload, indent=2)}")
    print(f"🔐 Headers: {json.dumps({k: v for k, v in headers.items() if k != 'Authorization'}, indent=2)}")
    print(f"🔑 Authorization: Bearer {api_key[:10]}...")
    print(f"🔒 Checksum: {checksum}")
    
    try:
        print("\n🚀 Making API request...")
        response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"📄 Response Body: {json.dumps(response_data, indent=2)}")
            
            # Analyze response
            if response.status_code == 200:
                print("✅ API call successful!")
                
                if response_data.get('id'):
                    print(f"✅ Payment ID created: {response_data['id']}")
                    print("✅ This should trigger SMS prompt to phone")
                else:
                    print("⚠️  No payment ID in response")
                    
                if response_data.get('status'):
                    print(f"📈 Payment Status: {response_data['status']}")
                
            elif response.status_code == 400:
                print("❌ Bad request - check payload format")
            elif response.status_code == 401:
                print("❌ Authentication failed - check API keys")
            elif response.status_code == 403:
                print("❌ Forbidden - check permissions")
            else:
                print(f"❌ API error: {response.status_code}")
                
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON response: {e}")
            print(f"📄 Raw Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        
    print("\n" + "=" * 60)

def test_clickpesa_service():
    """Test ClickPesaService class"""
    print("\n🧪 Testing ClickPesaService Class")
    print("=" * 60)
    
    try:
        # Create test data
        shop = Shop.objects.first()
        if not shop:
            print("❌ No shop found")
            return False
        
        guest_customer = GuestCustomer.objects.create(
            name="Debug Test User",
            whatsapp_number="+255712345678",
            email="debug@test.com"
        )
        
        order = Order.objects.create(
            guest_customer=guest_customer,
            shop=shop,
            total_price=Decimal("5000.00"),
            commission_fee=Decimal("250.00"),
            payment_status=Order.PaymentStatus.PENDING_PAYMENT,
            status=Order.Status.UPLOADED
        )
        
        payment = Payment.objects.create(
            order=order,
            payment_method=Payment.PaymentMethod.MPESA,
            amount=order.total_price,
            phone_number="+255712345678",
            status=Payment.Status.PENDING,
            clickpesa_payment_id="debug_test_payment_id"
        )
        
        print(f"✅ Created test payment: {payment.id}")
        
        # Test the service
        service = ClickPesaService()
        result = service.initiate_mobile_money_payment(
            payment, 
            "+255712345678", 
            Payment.PaymentMethod.MPESA
        )
        
        print(f"🎯 Service Result: {json.dumps(result, indent=2)}")
        
        if result['success']:
            print("✅ ClickPesaService call successful!")
            print("📱 SMS should be sent to +255712345678")
        else:
            print("❌ ClickPesaService call failed!")
            print(f"💥 Error: {result.get('error', 'Unknown error')}")
        
        return result['success']
        
    except Exception as e:
        print(f"❌ Service test failed: {e}")
        return False

def check_clickpesa_credentials():
    """Check if ClickPesa credentials are valid"""
    print("\n🔐 Checking ClickPesa Credentials")
    print("=" * 60)
    
    # These look like demo/test credentials
    client_id = "ID0ubLc8rfWFrrkr3Tz0PigSMuYthyxK"
    api_key = "SKJ0lxbD1ePo8IDglXpnTBoioRFdytEjXw4bk2UJLT"
    
    print(f"Client ID: {client_id}")
    print(f"API Key: {api_key}")
    
    # Check if these are demo credentials
    demo_patterns = [
        "ID0ubLc8rfWFrrkr3Tz0PigSMuYthyxK",
        "SKJ0lxbD1ePo8IDglXpnTBoioRFdytEjXw4bk2UJLT",
        "test",
        "demo",
        "sandbox"
    ]
    
    is_demo = any(pattern in client_id.lower() or pattern in api_key.lower() for pattern in demo_patterns)
    
    if is_demo:
        print("⚠️  WARNING: These appear to be DEMO/TEST credentials!")
        print("📝 Demo credentials typically don't send real SMS prompts")
        print("🔄 You need PRODUCTION credentials from ClickPesa")
        print("📞 Contact ClickPesa support for production API keys")
    else:
        print("✅ Credentials appear to be production keys")
    
    print(f"🔍 Demo Credentials Detected: {is_demo}")
    return not is_demo

def main():
    """Run all debug tests"""
    print("🐛 ClickPesa API Debug Tool")
    print("=" * 80)
    
    # Check credentials
    are_production = check_clickpesa_credentials()
    
    # Test API directly
    test_clickpesa_api_directly()
    
    # Test service class
    if are_production:
        test_clickpesa_service()
    
    print("\n" + "=" * 80)
    print("📝 SUMMARY:")
    if not are_production:
        print("❌ ISSUE IDENTIFIED: Using demo/test ClickPesa credentials")
        print("🔧 SOLUTION: Get production credentials from ClickPesa dashboard")
        print("📞 STEPS:")
        print("   1. Login to ClickPesa dashboard")
        print("   2. Go to API Keys section") 
        print("   3. Generate production API keys")
        print("   4. Update .env file with production keys")
        print("   5. Restart Django server")
        print("\n💡 Without production credentials, no real SMS will be sent!")
    else:
        print("✅ Production credentials detected - SMS should work")

if __name__ == "__main__":
    main()
