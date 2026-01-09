"""
GAAIUS AI Builder - Backend API Tests
Tests for Blueprint-First architecture, templates, and quality gate v2
"""
import pytest
import requests
import os
import json

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://gaaius-studio-1.preview.emergentagent.com')

class TestBuildTemplates:
    """Tests for /api/build/templates endpoint"""
    
    def test_get_templates_returns_200(self):
        """GET /api/build/templates should return 200"""
        response = requests.get(f"{BASE_URL}/api/build/templates")
        assert response.status_code == 200
        print(f"✓ GET /api/build/templates returned 200")
    
    def test_templates_contains_expected_keys(self):
        """Templates response should contain expected template keys"""
        response = requests.get(f"{BASE_URL}/api/build/templates")
        data = response.json()
        
        assert "templates" in data
        templates = data["templates"]
        
        # Check for expected templates
        template_keys = [t["key"] for t in templates]
        expected_keys = ["saas_dashboard", "ecommerce", "admin_panel", "ai_tool", "crypto_finance"]
        
        for key in expected_keys:
            assert key in template_keys, f"Missing template: {key}"
        
        print(f"✓ All expected templates present: {expected_keys}")
    
    def test_template_structure(self):
        """Each template should have name, description, and features"""
        response = requests.get(f"{BASE_URL}/api/build/templates")
        data = response.json()
        
        for template in data["templates"]:
            assert "key" in template
            assert "name" in template
            assert "description" in template
            assert "features" in template
            assert isinstance(template["features"], list)
        
        print(f"✓ All templates have correct structure")


class TestBuildBlueprint:
    """Tests for /api/build/blueprint endpoint"""
    
    def test_blueprint_returns_200(self):
        """POST /api/build/blueprint should return 200"""
        response = requests.post(
            f"{BASE_URL}/api/build/blueprint",
            json={"prompt": "Build a dashboard", "template": "saas_dashboard"}
        )
        assert response.status_code == 200
        print(f"✓ POST /api/build/blueprint returned 200")
    
    def test_blueprint_with_saas_template(self):
        """Blueprint with saas_dashboard template should return correct structure"""
        response = requests.post(
            f"{BASE_URL}/api/build/blueprint",
            json={"prompt": "Build a SaaS dashboard with stats", "template": "saas_dashboard"}
        )
        data = response.json()
        
        assert "blueprint" in data
        blueprint = data["blueprint"]
        
        assert blueprint["template_used"] == "saas_dashboard"
        assert blueprint["template_name"] == "SaaS Dashboard"
        assert blueprint["app_type"] == "dashboard"
        assert "pages" in blueprint
        assert len(blueprint["pages"]) > 0
        
        print(f"✓ SaaS Dashboard blueprint generated correctly")
    
    def test_blueprint_with_ecommerce_template(self):
        """Blueprint with ecommerce template should return correct structure"""
        response = requests.post(
            f"{BASE_URL}/api/build/blueprint",
            json={"prompt": "Create an e-commerce store", "template": "ecommerce"}
        )
        data = response.json()
        
        blueprint = data["blueprint"]
        assert blueprint["template_used"] == "ecommerce"
        assert blueprint["template_name"] == "E-commerce Store"
        
        print(f"✓ E-commerce blueprint generated correctly")
    
    def test_blueprint_auto_detect_template(self):
        """Blueprint should auto-detect template from prompt"""
        response = requests.post(
            f"{BASE_URL}/api/build/blueprint",
            json={"prompt": "Build a crypto trading dashboard with portfolio"}
        )
        data = response.json()
        
        blueprint = data["blueprint"]
        # Should auto-detect crypto_finance template
        assert blueprint["template_used"] == "crypto_finance"
        
        print(f"✓ Template auto-detection working")
    
    def test_blueprint_includes_available_templates(self):
        """Blueprint response should include available_templates"""
        response = requests.post(
            f"{BASE_URL}/api/build/blueprint",
            json={"prompt": "Build something"}
        )
        data = response.json()
        
        assert "available_templates" in data
        assert len(data["available_templates"]) >= 5
        
        print(f"✓ Available templates included in response")


class TestBuildGenerate:
    """Tests for /api/build/generate endpoint"""
    
    def test_generate_returns_200(self):
        """POST /api/build/generate should return 200"""
        response = requests.post(
            f"{BASE_URL}/api/build/generate",
            json={"prompt": "Create a simple landing page"},
            timeout=120
        )
        assert response.status_code == 200
        print(f"✓ POST /api/build/generate returned 200")
    
    def test_generate_returns_code(self):
        """Generate should return HTML code"""
        response = requests.post(
            f"{BASE_URL}/api/build/generate",
            json={"prompt": "Create a simple landing page with hero section"},
            timeout=120
        )
        data = response.json()
        
        assert "code" in data
        assert len(data["code"]) > 500  # Should have substantial code
        assert "<!DOCTYPE" in data["code"].upper() or "<HTML" in data["code"].upper()
        
        print(f"✓ Generate returned valid HTML code ({len(data['code'])} chars)")
    
    def test_generate_returns_quality_score(self):
        """Generate should return quality score and checks"""
        response = requests.post(
            f"{BASE_URL}/api/build/generate",
            json={"prompt": "Build a dashboard with stats cards"},
            timeout=120
        )
        data = response.json()
        
        assert "quality_score" in data
        assert isinstance(data["quality_score"], (int, float))
        assert 0 <= data["quality_score"] <= 100
        
        print(f"✓ Quality score returned: {data['quality_score']}/100")
    
    def test_generate_returns_quality_checks(self):
        """Generate should return quality_checks array"""
        response = requests.post(
            f"{BASE_URL}/api/build/generate",
            json={"prompt": "Build a modern dashboard"},
            timeout=120
        )
        data = response.json()
        
        assert "quality_checks" in data
        assert isinstance(data["quality_checks"], list)
        
        print(f"✓ Quality checks returned: {data['quality_checks']}")
    
    def test_generate_returns_quality_issues(self):
        """Generate should return quality_issues array"""
        response = requests.post(
            f"{BASE_URL}/api/build/generate",
            json={"prompt": "Build a simple page"},
            timeout=120
        )
        data = response.json()
        
        assert "quality_issues" in data
        assert isinstance(data["quality_issues"], list)
        
        print(f"✓ Quality issues returned: {len(data['quality_issues'])} issues")
    
    def test_generate_returns_blueprint_info(self):
        """Generate should return blueprint info in response"""
        response = requests.post(
            f"{BASE_URL}/api/build/generate",
            json={"prompt": "Build a SaaS dashboard", "template": "saas_dashboard"},
            timeout=120
        )
        data = response.json()
        
        assert "blueprint" in data
        blueprint = data["blueprint"]
        assert "app_name" in blueprint
        assert "template" in blueprint
        assert "app_type" in blueprint
        
        print(f"✓ Blueprint info returned: {blueprint}")


class TestHealthAndBasics:
    """Basic health and connectivity tests"""
    
    def test_health_endpoint(self):
        """Health endpoint should return healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print(f"✓ Health check passed")
    
    def test_root_endpoint(self):
        """Root API endpoint should return operational status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data or "message" in data
        print(f"✓ Root endpoint working")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
