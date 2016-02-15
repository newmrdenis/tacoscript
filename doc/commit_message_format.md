Commit Message Conventions
==========================
These rules are adopted from [the AngularJS commit conventions]. Markdown
originally from [stephenparish's gist].

* [Goals](#goals)
* [Generating CHANGELOG.md](#generating-changelogmd)
  * [Recognizing unimportant commits](#recognizing-unimportant-commits)
  * [Provide more information when browsing the history](#provide-more-information-when-browsing-the-history)
* [Format of the commit message](#format-of-the-commit-message)
  * [Subject line](#subject-line)
    * [Allowed `<type>`](#allowed-type)
    * [Allowed `<scope>`](#allowed-scope)
    * [`<subject>` text](#subject-text)
  * [Message body](#message-body)
  * [Message footer](#message-footer)
    * [Breaking changes](#breaking-changes)
    * [Referencing issues](#referencing-issues)
  * [Examples](#examples)

Goals
-----
* allow generating CHANGELOG.md by script
* allow ignoring commits by git bisect (not important commits like formatting)
* provide better information when browsing the history

Generating CHANGELOG.md
-----------------------
We use these three sections in changelog: new features, bug fixes, breaking
changes. This list could be generated by script when doing a release. Along with
links to related commits. Of course you can edit this change log before actual
release, but it could generate the skeleton.

List of all subjects (first lines in commit message) since last release:
```bash
git log <last tag> HEAD --pretty=format:%s
```


New features in this release
```bash
git log <last release> HEAD --grep feature
```

### Recognizing unimportant commits
These are formatting changes (adding/removing spaces/empty lines, indentation),
missing semi colons, comments. So when you are looking for some change, you can
ignore these commits - no logic change inside this commit.

When bisecting, you can ignore these by:
```bash
git bisect skip $(git rev-list --grep irrelevant <good place> HEAD)
```

### Provide more information when browsing the history
This would add kinda “context” information.
Look at these messages (taken from last few angular’s commits):
* Fix small typo in docs widget (tutorial instructions)
* Fix test for scenario.Application - should remove old iframe
* docs - various doc fixes
* docs - stripping extra new lines
* Replaced double line break with single when text is fetched from Google
* Added support for properties in documentation


All of these messages try to specify where is the change. But they don’t share
any convention...

Look at these messages:
* fix comment stripping
* fixing broken links
* Bit of refactoring
* Check whether links do exist and throw exception
* Fix sitemap include (to work on case sensitive linux)

Are you able to guess what’s inside ? These messages misplace specification...
So maybe something like parts of the code: docs, docs-parser, compiler,
scenario-runner, …

I know, you can find this information by checking which files had been changed,
but that’s slow. And when looking in git history I can see all of us tries to
specify the place, only missing the convention.

---

Format of the commit message
----------------------------
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the
message to be easier to read on github as well as in various git tools.

### Subject line        
Subject line contains succinct description of the change.

#### Allowed `<type>`
* feat (feature)
* fix (bug fix)
* docs (documentation)
* style (formatting, missing semi colons, …)
* refactor
* test (when adding missing tests)
* chore (maintain)
* wip (work in progress) _before 1.0.0 only_

Any types are allowed from within branches, as long as the merge commit is
formatted properly. _Make sure to merge the branch with no-ff_

#### Allowed `<scope>`
Scope could be anything specifying place of the commit change. For example
horchata, tacotruck, comal, comal-types, alpastor, iife-with, etc...

#### `<subject>` text
* use imperative, present tense: “change” not “changed” nor “changes”
* don't capitalize first letter
* no dot (.) at the end

### Message body
* just as in <subject> use imperative, present tense: “change” not “changed” nor
  “changes”
* includes motivation for the change and contrasts with previous behavior

http://365git.tumblr.com/post/3308646748/writing-git-commit-messages
http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html

### Message footer

#### Breaking changes

All breaking changes have to be mentioned in footer with the description of the
change, justification and migration notes

```
BREAKING CHANGE:
    isolate scope bindings definition has changed and the inject option for the
    directive controller injection was removed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
      myBind: 'bind',
      myExpression: 'expression',
      myEval: 'evaluate',
      myAccessor: 'accessor'
    }

    After:

    scope: {
      myAttr: '@',
      myBind: '@',
      myExpression: '&',
      // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
      myAccessor: '=' // in directive's template change myAccessor() to myAccessor
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

#### Referencing issues

Closed bugs should be listed on a separate line in the footer prefixed with
"Closes" keyword like this:
```
Closes #234
```

or in case of multiple issues:
```
Closes #123, #245, #992
```


[the AngularJS commit conventions]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/
[stephenparish's gist]: https://gist.github.com/stephenparish/9941e89d80e2bc58a153