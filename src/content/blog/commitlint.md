---
title: "Better Collaborate"
description: "Collaborate on a larger scale with a standardized commit messages"
pubDate: "Jan 21 2024"
heroImage: "/blogs/commitlint.webp"
tags:
  ["git", "commit", "collaborate", "commitlint", "dx", "development", "github"]
---

Collaborate on a larger scale with a standardized commit messages

Thanks to https://www.conventionalcommits.org/en/v1.0.0/

## What's Conventional Commits

Conventional Commits is a commit message convention that creates a format for structuring commit messages. It defines a format with a type, an optional scope, and a message.

This will be very useful when your project scales soo big with large developer base as it standardizes commit messages and provides informations at a glance without any confusion.

The format of commit messages as per [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) are

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Where

- `<type>` is one from the [types here](#types-of-commits)
- `[optional scope]` refers to a [scope](#about-scopes) of the type
- `<description>` is the commit description.

- `[optional body]` is used when description is not enough for content
- `[optional footer]` is used for footer of the commit message

<blockquote type="tip">

A commit that has a footer `BREAKING CHANGE:`, or appends a `!` after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A  `BREAKING CHANGE` can be part of commits of any type.

Example:

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

```
feat(api)!: send an email to the customer when a product is shipped
```

These are some of the commit messages that let users know it consist of a `BREAKING CHANGE`

</blockquote>

## Types of commits

- `feat`: A new feature for the user or a significant change.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Code style changes (formatting, etc.).
- `refactor`: Code refactoring without adding new features or fixing bugs.
- `test`: Adding or modifying tests.
- `chore`: Routine tasks, maintenance, or tooling changes.

## About Scopes

Scopes provide additional context about where the changes are applied. Examples include the module, component, or section of the project.
Scopes are optional but can be valuable in larger projects with multiple components.

For example, lets say i am posting this blog post, i can commit as

```sh
git commit -m "docs(blog): new post"
```

where `(blog)` is the scope of the type `docs`

## Use cases

### feat

`feat` or Feature is a type thats widely used when the commit adds a new feature or contains a huge change which changes its features

```scss
feat(user-auth): add password reset functionality;
```

### fix

`fix` is a type thats self explanatory. It is used when the commit consist of a bug fix

```scss
fix(database): resolve issue with data retrieval;
```

### docs

`docs` is used when there is changes or addition to project's documentations. That include `README.md`, Comments in the code, Guides, Changelogs, etc..

```scss
docs(readme): update project documentation;
```

### style

`style` type is used when the commit is related to code style changes, such as formatting, indentation, or code styling improvements.

```scss
style(css): update formatting for consistent styling;
```

### refactor

`refactor` is a type you can use when such commit is about code refactoring, which involves restructuring code without adding new features or fixing bugs.

```scss
refactor(api): reorganize function parameters for clarity;
```

### test

A commit related to tests, including the addition or modification of test cases uses `test` type.

```scss
test(unit): add test cases for user authentication;
```

### chore

`chore` is used when a commit is related to routine tasks, maintenance, or tooling changes that don't directly impact the user or introduce new features.

It is also used when you are bumping the package versions or removing, adding packages.

```scss
chore(dependencies): update npm packages to latest versions;
```

## But why ?

CI/CD pipelines may include automated checks for commit message conventions to ensure that only properly formatted commits are accepted.

But according to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#why-use-conventional-commits):

- Automatically generating CHANGELOGs.
- Automatically determining a semantic version bump (based on the types of commits landed).
- Communicating the nature of changes to teammates, the public, and other stakeholders.
- Triggering build and publish processes.
- Making it easier for people to contribute to your projects, by allowing them to explore a more structured commit history.

You can take a look at the [FAQ](https://www.conventionalcommits.org/en/v1.0.0/#faq) given by the Conventional Commits.

I have started to follow these conventions to streamline the workflow and be consistent throughout the projects. I took `New year, new me` very seriously and hoping to make myself a better person. Thank you.