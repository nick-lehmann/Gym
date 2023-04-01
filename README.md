# Problem Gym


Features
- [ ] Manage problems
  - [ ] List problems
	- [ ] Open up all solutions to a problem
	- [ ] Create text overview
- [ ] Create new problems
	- [ ] New files from a template
	- [ ] Download test data
- [ ] Verify problems
  - [ ] Run tests
  - [ ] Benchmark


## Outline

- Problem (core concept)
	- Task description
	- Implementation in some languages
	- Found in a provider
	- Contains a set of tests
	- Can have sub-problems

- Problem Identifier
  - single or multiple values that uniquely identify a problem
	- the format depends on a provider

- Solution
  - Implementation of a single problem in a single language
  - Stored in a file

- Test
  - Bound to a specific problem
	- Independent of the actual implementation
	- Found in a provider or created manually
	- Set of input data with a corresponding solution
	- Visualization?

- Providers (e.g., AdventOfCode, Leetcode, etc.)
	- Contain a set of problems with corresponding test cases