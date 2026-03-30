#!/usr/bin/env python
"""Test script to verify backend imports work correctly"""

try:
    import main
    print("✓ Backend loaded successfully")
    print("✓ Character creation endpoints should be available")
    print("\nAvailable endpoints:")
    print("  POST /characters/create - Create new character")
    print("  GET /characters/{user_id} - Get user's character")
    print("  PUT /characters/{user_id} - Update user's character")
    print("  GET /characters/{user_id}/preview - Get avatar preview")
except Exception as e:
    print(f"✗ Failed to load backend: {e}")
    import traceback
    traceback.print_exc()
