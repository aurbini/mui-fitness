// Test Supabase connection
import { createClient } from "@supabase/supabase-js";

// Replace with your actual Supabase credentials
const supabaseUrl = "YOUR_SUPABASE_URL_HERE";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY_HERE";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log("Testing Supabase connection...");

    // Test 1: Check if we can connect
    const { data, error } = await supabase
      .from("muscle_groups")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Connection failed:", error);
    } else {
      console.log("✅ Supabase connection successful!");
      console.log("Sample data:", data);
    }

    // Test 2: Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("Current user:", user ? "Logged in" : "Not logged in");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testConnection();
