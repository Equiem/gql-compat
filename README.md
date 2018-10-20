# GraphQL Compatibility Checker

A CLI tool for checking whether one GraphQL schema is backwards compatible with another.

## Installation

### Global
```bash
npm install -g https://github.com/Equiem/graphql-compat#master
gql-compat --help
```

### Local
```bash
npm install --save-dev https://github.com/Equiem/graphql-compat#master
```

Then in `package.json` add:

```json
{
  "scripts": {
    "script-name": "gql-compat [options]"
  }
}
```

## Examples

Compare schema in master against schema in current working copy.

```bash
$ gql-compat --old-schema 'origin/master:path/to/*/*.graphql' --new-schema 'path/to/*/*.graphql'
```

Append to whitelist file.

```bash
$ gql-compat -o 'origin/master:path/to/*/*.graphql' -n 'path/to/*/*.graphql' --format whitelist >> path/to/whitelist.json
```

Ignore ignored breaking changes store in whitelist file.

```bash
$ gql-compat -o 'origin/master:path/to/*/*.graphql' -n 'path/to/*/*.graphql' --whitelist path/to/whitelist.json
```

## Known Issues

### Pattern Matching

There is a difference between glob matching for the working copy vs. the contents
of a committish. The former uses a glob match, whereas the latter uses the pattern
matching of git ls-tree.

For example, the following command will match files differently in the working copy vs. the committish:

Command:
```bash
$ gql-compat -o 'origin/master:path/to/**/*.graphql' -n 'path/to/**/*.graphql' --whitelist path/to/whitelist.json
```

Files matched in orign/master:
```
- path/to/dir/file1.graphql
- path/to/dir/file2.graphql
```

Files matched in working copy:
```
- path/to/dir1/file1.graphql
- path/to/dir1/file2.graphql
- path/to/dirl/dir2/file3.graphql
```

So the pattern matching of patterns in a committish can only support finite nesting patterns. Eg. `origin/master:path/to/{*,*/*,*/*/*}/*.graphql`, which will recurse down into 3 subdirectories. This is a limitation of `git ls-tree`.
