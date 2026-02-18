# Permission Format

## Overview
The permission is a string that represents a authorization in the project. It is composed of two parts: the resource and the action. The resource is the entity that is being authorized, and the action is the operation that is being performed on the resource. The string is always in lowercase.

## Format

```
<resource>:<action>
```

## Examples

```
user:create
user:read
user:update
user:delete
```