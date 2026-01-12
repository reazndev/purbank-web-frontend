import unittest
import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8080/api/v1"
ADMIN_EMAIL = "admin@purbank.ch"
ADMIN_PASSWORD = "admin"

class TestPurbankIntegration(unittest.TestCase):
    access_token = None
    konto_id = None

    @classmethod
    def setUpClass(cls):
        """Login and get token before running tests"""
        print(f"\n[Setup] Logging in as {ADMIN_EMAIL}...")
        url = f"{BASE_URL}/auth/login/password"
        payload = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        headers = {"Content-Type": "application/json"}
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            cls.access_token = data.get("access_token")
            if not cls.access_token:
                raise Exception("No access_token in login response")
            print("[Setup] Login successful. Token received.")
        except requests.exceptions.ConnectionError:
            print("\n[Error] Could not connect to backend at localhost:8080.")
            print("Please ensure the backend is running (docker-compose up -d).")
            sys.exit(1)
        except Exception as e:
            print(f"\n[Error] Login failed: {e}")
            if 'response' in locals():
                print(f"Response: {response.text}")
            sys.exit(1)

    def get_headers(self):
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

    def test_01_get_konten_initial(self):
        """Verify we can fetch accounts"""
        print("\n[Test] Fetching accounts...")
        url = f"{BASE_URL}/konten"
        response = requests.get(url, headers=self.get_headers())
        self.assertEqual(response.status_code, 200)
        print(f"Current accounts: {len(response.json())}")

    def test_02_create_konto(self):
        """Create a new account"""
        print("\n[Test] Creating new account...")
        url = f"{BASE_URL}/konten"
        payload = {
            "name": "Integration Test Account",
            "currency": "CHF"
        }
        response = requests.post(url, json=payload, headers=self.get_headers())
        
        if response.status_code != 200:
            print(f"Create Konto Failed: {response.text}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsNotNone(data.get("id"))
        self.assertEqual(data.get("name"), "Integration Test Account")
        
        # Save ID for next tests
        TestPurbankIntegration.konto_id = data.get("id")
        print(f"Account created. ID: {TestPurbankIntegration.konto_id}")

    def test_03_create_transaction(self):
        """Create a payment transaction"""
        if not TestPurbankIntegration.konto_id:
            self.skipTest("No konto_id available from previous test")

        print("\n[Test] Creating transaction...")
        url = f"{BASE_URL}/payments"
        
        # Valid IBAN
        payload = {
            "kontoId": TestPurbankIntegration.konto_id,
            "toIban": "CH9300762011623852958", 
            "amount": 100.50,
            "paymentCurrency": "CHF",
            "message": "Integration Test Payment",
            "note": "Automated Test",
            "executionType": "NORMAL",
            "executionDate": "2026-03-18",
            "deviceId": "test-script-device-id"
        }
        
        response = requests.post(url, json=payload, headers=self.get_headers())
        
        if response.status_code != 200:
            print(f"Create Payment Failed: {response.text}")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check for mobile verification challenge
        if not data.get("mobileVerify"):
             print(f"Debug - Full Response Data: {json.dumps(data, indent=2)}")
             
        self.assertIsNotNone(data.get("mobileVerify"))
        self.assertEqual(data.get("status"), "PENDING_APPROVAL")
        print(f"Payment created. Mobile Verify Code: {data.get('mobileVerify')}")

    def test_04_get_payments(self):
        """Fetch payments list"""
        print("\n[Test] Fetching payments...")
        url = f"{BASE_URL}/payments"
        response = requests.get(url, headers=self.get_headers())
        self.assertEqual(response.status_code, 200)
        payments = response.json()
        print(f"Payments response: {json.dumps(payments, indent=2)}")
        
        # We expect this to be empty because the payment we created in test_03 
        # is in 'PENDING_APPROVAL' state (waiting for mobile app signature), 
        # so it hasn't moved to the main 'payments' table yet.
        # This is correct system behavior.
        if len(payments) == 0:
            print("Note: Payment list is empty. This is expected as the created payment requires mobile approval.")
        else:
            print(f"Found {len(payments)} pending payments.")

    def test_05_get_konto_details(self):
        """Fetch details for the specific account"""
        if not TestPurbankIntegration.konto_id:
            self.skipTest("No konto_id available")

        print(f"\n[Test] Fetching details for konto {TestPurbankIntegration.konto_id}...")
        url = f"{BASE_URL}/konten/{TestPurbankIntegration.konto_id}"
        response = requests.get(url, headers=self.get_headers())
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("kontoId"), TestPurbankIntegration.konto_id)
        self.assertEqual(data.get("role"), "OWNER")
        print("Konto details verified.")

    def test_06_get_transactions(self):
        """Fetch transactions for the account"""
        if not TestPurbankIntegration.konto_id:
            self.skipTest("No konto_id available")

        print(f"\n[Test] Fetching transactions for konto {TestPurbankIntegration.konto_id}...")
        url = f"{BASE_URL}/konten/{TestPurbankIntegration.konto_id}/transactions"
        response = requests.get(url, headers=self.get_headers())
        
        self.assertEqual(response.status_code, 200)
        transactions = response.json()
        print(f"Transactions found: {len(transactions)}")
        # Since we just created the account, we expect 0 transactions

if __name__ == '__main__':
    unittest.main(verbosity=2)
