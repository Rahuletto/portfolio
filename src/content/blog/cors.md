---
title: "Cross Origin Resource Sharing"
description: "Learn more about CORS, its importance and its features"
pubDate: "Apr 21 2024"
heroImage: "/blogs/cors.webp"
tags:
  [
    "cors",
    "api",
    "fetch",
    "datafetching",
    "http",
    "web",
  ]
---


### What is CORS?

CORS is a security mechanism built into web browsers that prevents requests from web sites going to a different origin than the one they were delivered from. An origin is made up of a domain, port number, and protocol (such as HTTP or HTTPS). In order to decide whether to allow or block a request made by a web page housed on one origin to a resource hosted on a different origin, the browser applies CORS policies.

### Why is CORS Important?

CORS plays a crucial role in protecting users' data and preventing malicious attacks, such as cross-site request forgery (CSRF) and cross-site scripting (XSS). By enforcing strict access controls on cross-origin requests, CORS helps ensure that sensitive information, such as user authentication tokens and session cookies, is not inadvertently exposed to unauthorized parties.

### How Does CORS Work?

When a web page makes a cross-origin request (e.g., via JavaScript's Fetch API), the browser automatically includes an "Origin" header in the request, indicating the origin from which the request originated. The server then responds with one of the following CORS headers:

- **Access-Control-Allow-Origin:** Specifies which origins are allowed to access the requested resource. If the requesting origin is listed in this header, the browser allows the request to proceed.
- **Access-Control-Allow-Methods:** Specifies which HTTP methods (e.g., GET, POST, PUT, DELETE) are allowed when accessing the resource.
- **Access-Control-Allow-Headers:** Specifies which headers are allowed in the request.
- **Access-Control-Allow-Credentials:** Indicates whether the browser should include credentials (e.g., cookies, HTTP authentication) in the request.
- **Access-Control-Max-Age:** Specifies how long the preflight request (OPTIONS) results should be cached by the browser.

### Common Challenges and Solutions

Although CORS offers security advantages, it can also cause developers trouble, particularly when interacting with third-party APIs or working with complex web infrastructures. Typical difficulties include:

- Missing or misconfigured CORS headers on the server.
- Handling preflight requests (OPTIONS) for non-simple requests (e.g., requests with custom headers or HTTP methods other than GET, POST, or HEAD).
- Dealing with CORS-related errors, such as "Access-Control-Allow-Origin" or "No 'Access-Control-Allow-Origin' header."

To overcome these challenges, developers can:

- Configure the server to include the appropriate CORS headers.
- Implement server-side logic to handle preflight requests and respond to CORS-related errors gracefully.
- Consider alternative approaches, such as JSONP (JSON with Padding) or server-side proxying, for circumventing CORS restrictions in certain scenarios.

But if they dont own the API, they are pretty much screwed. (kinda)
as said earlier, we can do proxy to overcome but not as reliable

### Conclusion

Understanding CORS is critical for designing safe, accessible applications in today's ever-changing web development landscape. Understanding the concepts of cross-origin resource sharing and understanding approaches for resolving CORS-related issues will help developers ensure that their applications remain possible and secure in today's connected web ecosystem. So, embrace CORS as a powerful ally on your web development adventure!