---
title: "An Introduction to Google's Memory Error Detect Tool AddessSanitizer"
date: 2020-02-18
description: "This posts introduces to you Google’s memory error detect tool AddressSanitizer, covering what it is, how it works, and some best practices."
author: "Simon"
tags: ["System-Testing"]
---

![AddressSanitizer.png](https://user-images.githubusercontent.com/56643819/74794701-d829a480-52fe-11ea-8fe7-6bd98a95dc39.png)

As a C/C++ developer, you will encounter various problems during development, the most common ones are **memory usage issues** such as **out of bounds, leakage**.

Previously the most commonly used memory error detect tool was [Valgrind](https://valgrind.org/), but the biggest problem with Valgrind is that it will greatly reduce program speed,  by 10 times by estimate.

Good news is the Google-developed memory error detect tool, [AddressSanitizer](https://github.com/google/sanitizers/wiki/AddressSanitizer) (aka ASan), has greatly improved the program slowdown to two times only on average, which is very fast.

This post gives an introduction to AddressSanitizer, covering what it is, how it works, feature comparison between AddressSanitizer and other memory detection tools, as well as some best practices utilizing AddressSanitizer.

## Introducing AddressSanitizer

AddressSanitizer is a compiler-based testing tool that detects various memory errors in C/C++ code at runtime.

Strictly speaking, AddressSanitizer is a compiler plug-in. It consists of two modules

- A compiler instrumentation module
- A run-time library that replaces malloc/free

The instrumentation module mainly deals with memory operations such as **store **and **load** at the compiler level.

The dynamic library mainly provides some complex functions at runtime such as poison/unpoison shadow memory and hooks system calling functions such as malloc/free.

### Basic Usage of AddressSanitizer

According to the official Wiki, AddressSanitizer finds:

- Use after free (dangling pointer dereference)
- Heap buffer overflow
- Stack buffer overflow
- Global buffer overflow
- Use after return
- Use after scope
- Initialization order bugs
- Memory leaks

In this post we only focus on the basic usage. For more details, please refer to the official compiler usage documents such as [Clang](https://clang.llvm.org/docs/AddressSanitizer.html).

#### Example on Use After Free

The following code is a very simple example of Use after free:

```cpp
//use_after_free.cpp
#include <iostream>
int main(int argc, char **argv) {
  int *array = new int[100];
  delete [] array;
  std::cout << array[0] << std::endl;
  return 1;
}
```

Now, compile the code and run the executable. Here you only need to build with the `-fsanitize = address` option when compiling.

```shell
clang++  -O -g -fsanitize=address ./use_after_free.cpp
./a.out
```

Finally we will see the following output:

```bash
==10960==ERROR: AddressSanitizer: heap-use-after-free on address 0x614000000040 at pc 0x00010d471df0 bp 0x7ffee278e6b0 sp 0x7ffee278e6a8
READ of size 4 at 0x614000000040 thread T0
    #0 0x10d471def in main use_after_free.cpp:6
    #1 0x7fff732c17fc in start (libdyld.dylib:x86_64+0x1a7fc)

0x614000000040 is located 0 bytes inside of 400-byte region [0x614000000040,0x6140000001d0)
freed by thread T0 here:
    #0 0x10d4ccced in wrap__ZdaPv (libclang_rt.asan_osx_dynamic.dylib:x86_64h+0x51ced)
    #1 0x10d471ca1 in main use_after_free.cpp:5
    #2 0x7fff732c17fc in start (libdyld.dylib:x86_64+0x1a7fc)

previously allocated by thread T0 here:
    #0 0x10d4cc8dd in wrap__Znam (libclang_rt.asan_osx_dynamic.dylib:x86_64h+0x518dd)
    #1 0x10d471c96 in main use_after_free.cpp:4
    #2 0x7fff732c17fc in start (libdyld.dylib:x86_64+0x1a7fc)

SUMMARY: AddressSanitizer: heap-use-after-free use_after_free.cpp:6 in main
```

The output clearly shows when the memory is freed and when it's reused.

#### Example on Memory leaks
In the following code, the memory that p points to is not freed.

```c
void *p;

int main() {
        p = malloc(7);
        p = 0; // The memory is leaked here.
        return 0;
}
```

Now compile and run.

```bash
clang -fsanitize=address -g  ./leak.c
./a.out
```

We can see the following outputs:

```bash
=================================================================
==17756==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 7 byte(s) in 1 object(s) allocated from:
    #0 0x4ffc80 in malloc (/home/simon.liu/workspace/a.out+0x4ffc80)
    #1 0x534ab8 in main /home/simon.liu/workspace/./leak.c:4:8
    #2 0x7f127c42af42 in __libc_start_main (/usr/lib64/libc.so.6+0x23f42)

SUMMARY: AddressSanitizer: 7 byte(s) leaked in 1 allocation(s).
```

Note that **memory leak detection will only be conducted before  exiting the program**, which means that if you continuously allocate memory and then free it at run time, AddressSanitizer will not detect memory leak. At this time you need JeMalloc/TCMalloc to help.

### Fundamentals of AddressSanitizer

In this post we will give a brief introduction to AddressSanitizer's fundamentals. If you are interested in knowing the details of the algorithm behind, pleased refer to [AddressSanitizer: a fast address sanity checker](https://www.usenix.org/system/files/conference/atc12/atc12-final39.pdf).

AddressSanitizer replaces all your malloc and free, and then marks the before and after of the memory area that has been allocated (malloc) as `poisoned` (mainly to deal with overflow). And the freed memory is marked as `poisoned` (mainly to deal with `use after free`). Every memory access in your code will be translated to  the following by the compiler.

Before:

```c
*address = ...;  // or: ... = *address;
```

After:

```c
shadow_address = MemToShadow(address);
if (ShadowIsPoisoned(shadow_address)) {
  ReportError(address, kAccessSize, kIsWrite);
}
*address = ...;  // or: ... = *address;
```

First we can see   a memory address translating (MemToShadow) process, followed by determining whether the accessed memory area is poisoned. If so, the tool will  report an error and exit.

The reason why the translation process is here is that AddressSanitizer divides virtual memory into two parts:

1. Main application memory（Mem）, the memory used by the current program
1. Shadow memory, a memory that holds main memory meta information. For example, those areas of main memory that are poisoned are stored in shadow memory.

### Comparison of AddressSanitizer and Other Memory Detection Tools

The following [figure](https://github.com/google/sanitizers/wiki/AddressSanitizerComparisonOfMemoryTools#summary) is the comparison of AddressSanitizer and other memory detection tools:

![image](https://user-images.githubusercontent.com/38887077/74824227-f1544480-5342-11ea-8986-8eb88adaa1b3.png)

Parameter Description:

- _**DBI**_: dynamic binary instrumentation
- _**CTI**_: compile-time instrumentation
- _**UMR**_: uninitialized memory reads
- _**UAF**_: use-after-free (aka dangling pointer)
- _**UAR**_: use-after-return
- _**OOB**_: out-of-bounds
- _**x86**_: includes 32- and 64-bit.

We can see that AddressSanitizer only slows down the program by 2 times compared to Valgrind's 10 times.

AddressSanitizer currently supports GCC since 4.8 release and Clang since 3.1 release.

### Tips on Using AddressSanitizer

1. **Force the program to crash upon errors.** When ASan finds a memory access violation, the program does not crash automatically. This is because fuzzing tools usually detect this kind of error by checking the return code. However, we can force the program to crash by modifying the environment variable `ASAN_OPTIONS` to the following  before fuzzing test:

```bash
export ASAN_OPTIONS='abort_on_error=1'/
```

2. **Disable memory limits to solve memory limitation problems, but pay attention to the potential risks**. AddressSanitizer requires huge virtual memory (about 20 TB). But don't worry, this is just virtual memory. You can still use your program. However, fuzzing tools like american fuzzy lop will limit the memory usage of fuzzed software, you can solve this problem by disabling memory limits. The only thing to note is the risks brought by such operation: test samples may cause the program to allocate a large amount of memory, which may cause system instability or other applications crash. Thus when performing important fuzz tests, don't try to disable memory limits on the same system.

## Turn on AddressSanitizer in Nebula Graph

We used AddressSanitizer in **Nebula Graph** to help us find a lot of problems. Enabling AddressSanitizer in **Nebula Graph** is very easy. You only need to add the `ENABLE_ASAN` option in Cmake as below:

```bash
Cmake -DENABLE_ASAN=On
```

It is recommended that all developers turn on AddressSanitizer to run unit tests. By doing so, we can find many memory problems that are not easy to find and save  debugging time.
