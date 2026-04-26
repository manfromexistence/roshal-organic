async function testAuth() {
  console.log("Testing authentication flow...\n");

  const baseUrl = "http://localhost:3000";

  try {
    // Test sign-in with admin user
    console.log("1. Testing sign-in with admin@gmail.com...");
    const signInResponse = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@gmail.com",
        password: "password",
      }),
    });

    console.log("Sign-in response status:", signInResponse.status);
    const signInData = await signInResponse.json();
    console.log("Sign-in response data:", JSON.stringify(signInData, null, 2));
    console.log();

    if (signInResponse.ok) {
      console.log("✅ Sign-in successful!");
      console.log("Session token:", signInData.token || "No token in response");
      console.log("User:", signInData.user || "No user in response");
    } else {
      console.log("❌ Sign-in failed!");
      console.log("Error:", signInData);
    }

    console.log("\n2. Testing sign-in with user@gmail.com...");
    const userSignInResponse = await fetch(
      `${baseUrl}/api/auth/sign-in/email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "user@gmail.com",
          password: "password",
        }),
      },
    );

    console.log("User sign-in response status:", userSignInResponse.status);
    const userSignInData = await userSignInResponse.json();
    console.log(
      "User sign-in response data:",
      JSON.stringify(userSignInData, null, 2),
    );
    console.log();

    if (userSignInResponse.ok) {
      console.log("✅ User sign-in successful!");
    } else {
      console.log("❌ User sign-in failed!");
    }

    console.log("\n3. Testing sign-up with new user...");
    const signUpResponse = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "testuser@gmail.com",
        password: "password",
        name: "Test User",
        role: "user",
      }),
    });

    console.log("Sign-up response status:", signUpResponse.status);
    const signUpData = await signUpResponse.json();
    console.log("Sign-up response data:", JSON.stringify(signUpData, null, 2));
    console.log();

    if (signUpResponse.ok) {
      console.log("✅ Sign-up successful!");
    } else {
      console.log("❌ Sign-up failed!");
    }
  } catch (error) {
    console.error("Error testing authentication:", error);
  }
}

testAuth();
