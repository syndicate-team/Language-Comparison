# Legend

## LSP

The language must have "intelligent IDE support", I don't mean specifically
support for the "Language Server Protocol" spec.

## No GC

The language must not do garbage collection at runtime.

## UB-safe

The language must not have undefined behavior. Having UB within isolated
discouraged sections (like unsafe blocks) it's okay.

## Memory safe

The language must not allow pointer arithmetic or casting an integer to a
pointer, or similar unsafe operations.

## Crossplatform

Crossplatform means the language is able to answer yes to these two questions:

"Is it a good experience to write medium-sized programs that will work on all
platforms the compiler supports?"

"Can you easily compile TO any platform FROM any platform?"

## Static types

The language must do type checking at compile time / JIT and require explicit
conversion for otherwise unsafe operations.

## Borrow checker

The language must track variable ownership.

## Rich ecosystem

The language must have a large community of users, and a reasonably big corpus
of third-party libraries.

## Small binaries

The language must be able to produce dependencyless binaries of tiny size for
simple programs.

TODO: define size for hello world

## Reasonably fast

TODO

## Fast compilation

The language must not be notorious for having compile-times of over a few
minutes for huge projects.

## Type level code

The syntax that deals with types should be turing-complete (or close to it).

## <250M dev install

Setting up a development environment and compilation toolchain for the language
should take up less than 250MB of your disk space.

## Full type erasure

Full type erasure means the types are completely gone at runtime by default
(optional explicit decoration per-declaration is okay).
