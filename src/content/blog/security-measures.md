---
title: "The Secure Coding Playbook"
description: "In an era of cyber attacks, securing your applications is non-negotiable."
pubDate: "Jan 07 2024"
heroImage: "/assets/blogs/security.webp"
tags: ["security", "cybersecurity", "software", "xss", "validation", "tips"]
---

In an era where cyber threats loom large, securing your applications is non-negotiable.Adopting secure coding practices is imperative for safeguarding your applications and user data. This blog post outlines essential secure coding practices to shield your applications from potential vulnerabilities and cyber attacks.

## Input Validation

Is there any user input on your website? To stop injection attacks, you should verify every input that users submit. By doing this, it is made impossible for malicious code to be injected via forms, URLs, or other input methods.

For example, lets try a Javascript code with mysql

```js
connection.query(
  "SELECT * FROM users WHERE username = ?",
  [username],
  (error, results) => {
    if (error) throw error;
    console.log(results);
  }
);
```

The example here uses placeholders `?` to separate code from data, preventing injection attacks.

### Cross-Site Scripting (XSS) Prevention:

To stop XSS attacks, sanitize user inputs and employ output encoding. This makes sure that data entered by the user cannot be used by the browser as code

We can escape HTML to prevent any injection.

```js
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

This replaces all unsafe text into its escaped counterparts. Preventing it to execute

### Code evaluation

Attackers can inject malicious code into the string passed to `eval()`, causing it to be executed with the same privileges as the compiler itself. This could lead to:

- Data theft or corruption
- System compromise
- Unauthorized actions

If `eval()` is unavoidable, strictly validate and sanitize input strings to prevent injection of malicious code.

## Encrypt Sensitive Data

Use strong encryption techniques to protect sensitive data in transit and at rest. This prevents wiretapping and illegal access to sensitive information.

<blockquote type="tip">

In NodeJS, We have `crypto` a native module to encrypt data with various algorithms. Learn more about it [here](https://nodejs.org/api/crypto.html)

</blockquote>

## Updated Dependencies

Keep all third-party libraries and frameworks up-to-date. Regularly check for security patches and updates to address vulnerabilities in your dependencies.

## Cross-Site Request Forgery (CSRF) Protection

CSRF, or Cross-site Request Forgery, is a type of web security vulnerability that tricks a user's browser into submitting unintended requests to a trusted website

<blockquote type="danger">

They essentially hijack your browser's trust in a website to perform actions you never intended!

</blockquote>

Implement anti-CSRF tokens to prevent attackers from executing malicious actions on behalf of authenticated users. This adds an extra layer of security to your application.

## Secure File Uploads

If your application allows file uploads, validate file types, limit file sizes, and store uploaded files in a secure location. This prevents attackers from exploiting vulnerabilities through manipulated files.

## Error Handling and Logging

Implement proper error handling to reveal minimal information in case of failures. Simultaneously, maintain detailed logs to monitor and detect unusual activities that may indicate a security breach.

## Session Management

Implement secure session management by using unique session identifiers, enforcing session timeouts, and regenerating session IDs after login. This mitigates the risk of session hijacking.

Passwords have become stronger, encrypted which takes years to decrypt and break in, This is not viable so they started with session hijacking

By using session tokens, attackers can bypass authentication mechanisms and gain access to the victim's account or sensitive information.

> [Verizon study found that approx 85% of breaches were caused due to the human element and were avoidable in the presence of robust security measures.](https://www.verizon.com/business/resources/reports/dbir/)

### Ways to prevent

#### Always rotate session keys after authentication

Changing the session key after a successful login makes it hard for a session hijacker to follow the user session even if they know the original key. Even if an attacker sends a phishing link the user clicks on, attackers can’t hijack sessions with self-generated keys in such setups.

Source: https://crashtest-security.com/session-hijacking-prevention/

## API Security Best Practices

Secure your application programming interfaces (APIs) by employing proper authentication, authorization, and encryption. Regularly audit and monitor API usage to detect and address potential vulnerabilities.

## Least Privilege Principle:

Adhere to the principle of least privilege by restricting user and system permissions to the minimum necessary for functionality. Limiting access rights minimizes the potential impact of a security breach.

By incorporating these advanced secure coding practices into your development lifecycle, you not only strengthen your defenses against cyber threats, but you also contribute to a more resilient and secure software environment. Remember that early safety precautions are a shared responsibility that involves both developers and the entire organization. Stay vigilant, stay secure.

References:

- https://owasp.org/www-community/attacks/
- https://crashtest-security.com
- https://www.kaspersky.com/resource-center/definitions
