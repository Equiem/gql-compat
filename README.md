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
$ gql-compat check 'origin/master:path/to/*/*.graphql' 'path/to/*/*.graphql'
```

Append all current breaking changes to the ignore file: `.gql-compat-ignore`.

```bash
$ gql-compat ignore 'origin/master:path/to/*/*.graphql' 'path/to/*/*.graphql'
```

Now all current breaking changes will be ignored for a period of time (the `--ignore-tolerance` period, which defaults to 7 days).

## Known Issues

### Pattern Matching

There is a difference between glob matching for the working copy vs. the contents
of a committish. The former uses a glob match, whereas the latter uses the pattern
matching of git ls-tree.

For example, the following command will match files differently in the working copy vs. the committish:

Command:
```bash
$ gql-compat 'origin/master:path/to/**/*.graphql' 'path/to/**/*.graphql'
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
