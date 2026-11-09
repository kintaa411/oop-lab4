#OOP Lab 4: Generics in Practice

Object-Oriented Programming, DAUST, Fall 2026

Student: YOUR NAME (YOUR STUDENT NUMBER)

A small library system in TypeScript. It shows the problem that any creates, then how generics, constraints and composition solve it, and finally what generics cannot do.

Contents
File	      Part	    What it shows
catalog.ts	1, 2, 6	    Catalog<T extends HasId> built on a Map, and Ratings<T extends HasId>
fees.ts	       3	            When a generic is needed: totalFees (no) vs mostCostly<T extends Borrowable> (yes)
reservations.ts	 4	    Queue<T> used as a part of Book (composition)
limits.ts	    5	        Generics are erased at runtime: JSON.parse returns unchecked data
ANSWERS.md	            all	Predictions, Questions 1 to 13, and the Mermaid class diagram
tsconfig.json	setup	Strict type checking for the editor