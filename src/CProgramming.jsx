import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from './components/SigmaIcon.jsx';
import AdBanner1 from './components/AdBanner1.jsx';
import AdBanner2 from './components/AdBanner2.jsx';

// Create VipCodes component
const VipCodes = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white text-xl font-bold tracking-wider flex items-center space-x-2">
                <SigmaIcon className="w-6 h-6" />
                <span>SIGMA</span>
              </Link>
            </div>
            <div className="flex space-x-8">
              <Link to="/chat" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Chat</Link>
              <Link to="/codes" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Code</Link>
              <span className="text-green-400 font-medium">VIP AREA</span>
            </div>
          </div>
        </div>
      </nav>
      <div className="pt-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wider">VIP CODE VAULT</h1>
          <p className="text-xl text-gray-400 font-light">Grade 11 Computer Practical Programs</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Link to="/codes/c-programming" className="group block">
            <div className="bg-gray-900 border border-gray-700 hover:border-blue-500 rounded-lg p-8 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">C Programming</h3>
                <p className="text-gray-400 mb-6">Complete collection of C programs for Grade 11 practicals</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Basic Programs - 6 programs</p>
                  <p>Loops - 4 programs</p>
                  <p>Arrays - 3 programs</p>
                </div>
                <div className="mt-6 text-blue-400 font-medium">13 Programs Available</div>
              </div>
            </div>
          </Link>
          <Link to="/codes/html-programming" className="group block">
            <div className="bg-gray-900 border border-gray-700 hover:border-orange-500 rounded-lg p-8 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">HTML Programming</h3>
                <p className="text-gray-400 mb-6">Complete collection of HTML programs for web development</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Basic HTML - 3 programs</p>
                  <p>Forms - 2 programs</p>
                  <p>Tables - 2 programs</p>
                </div>
                <div className="mt-6 text-orange-400 font-medium">7 Programs Available</div>
              </div>
            </div>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-xs text-gray-500 font-light">Made By OG Rusil</p>
        </div>
      </div>
    </div>
  );
};

const CProgramming = () => {
  const [copiedCode, setCopiedCode] = useState('');

  const copyCode = async (code, codeId) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // C Programming Codes
  const cPrograms = [
    // Basic Programs
    {
      id: 'c_hello',
      title: '1. Hello World Program',
      description: 'Basic C program to print Hello World',
      category: 'Basic Programs',
      code: `#include <stdio.h>
int main() {
    printf("Hello, World!\\n");
    return 0;
}`
    },
    {
      id: 'c_sum',
      title: '2. Sum of Two Numbers',
      description: 'Program to add two numbers entered by user',
      category: 'Basic Programs',
      code: `#include <stdio.h>
int main() {
    int a, b, sum;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    sum = a + b;
    printf("Sum = %d\\n", sum);
    return 0;
}`
    },
    {
      id: 'c_even_odd',
      title: '3. Check Even or Odd',
      description: 'Program to check if a number is even or odd',
      category: 'Basic Programs',
      code: `#include <stdio.h>
int main() {
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    if (num % 2 == 0)
        printf("%d is even\\n", num);
    else
        printf("%d is odd\\n", num);
    return 0;
}`
    },
    {
      id: 'c_factorial',
      title: '4. Factorial Program',
      description: 'Program to find factorial of a number',
      category: 'Basic Programs',
      code: `#include <stdio.h>
int main() {
    int n, i, fact = 1;
    printf("Enter a number: ");
    scanf("%d", &n);
    for (i = 1; i <= n; i++)
        fact = fact * i;
    printf("Factorial = %d\\n", fact);
    return 0;
}`
    },
    {
      id: 'c_largest',
      title: '5. Find Largest of Three Numbers',
      description: 'Program to find the largest among three numbers',
      category: 'Basic Programs',
      code: `#include <stdio.h>
int main() {
    int a, b, c, largest;
    printf("Enter three numbers: ");
    scanf("%d %d %d", &a, &b, &c);
    
    largest = a;
    if (b > largest)
        largest = b;
    if (c > largest)
        largest = c;
        
    printf("Largest number = %d\\n", largest);
    return 0;
}`
    },
    {
      id: 'c_swap',
      title: '6. Swap Two Numbers',
      description: 'Program to swap two numbers using temporary variable',
      category: 'Basic Programs',
      code: `#include <stdio.h>
int main() {
    int a, b, temp;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    
    printf("Before swapping: a = %d, b = %d\\n", a, b);
    
    temp = a;
    a = b;
    b = temp;
    
    printf("After swapping: a = %d, b = %d\\n", a, b);
    return 0;
}`
    },
    // Loops Programs
    {
      id: 'c_print_numbers',
      title: '7. Print Numbers 1 to 10',
      description: 'Program using for loop to print numbers',
      category: 'Loops',
      code: `#include <stdio.h>
int main() {
    int i;
    printf("Numbers from 1 to 10:\\n");
    for (i = 1; i <= 10; i++) {
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`
    },
    {
      id: 'c_multiplication_table',
      title: '8. Multiplication Table',
      description: 'Program to print multiplication table',
      category: 'Loops',
      code: `#include <stdio.h>
int main() {
    int n, i;
    printf("Enter a number: ");
    scanf("%d", &n);
    printf("Multiplication table of %d:\\n", n);
    for (i = 1; i <= 10; i++) {
        printf("%d x %d = %d\\n", n, i, n*i);
    }
    return 0;
}`
    },
    {
      id: 'c_sum_natural',
      title: '9. Sum of Natural Numbers',
      description: 'Program to find sum of first n natural numbers',
      category: 'Loops',
      code: `#include <stdio.h>
int main() {
    int n, i, sum = 0;
    printf("Enter a number: ");
    scanf("%d", &n);
    
    for (i = 1; i <= n; i++) {
        sum += i;
    }
    
    printf("Sum of first %d natural numbers = %d\\n", n, sum);
    return 0;
}`
    },
    {
      id: 'c_reverse_number',
      title: '10. Reverse a Number',
      description: 'Program to reverse digits of a number',
      category: 'Loops',
      code: `#include <stdio.h>
int main() {
    int num, reversed = 0, remainder;
    printf("Enter a number: ");
    scanf("%d", &num);
    
    while (num != 0) {
        remainder = num % 10;
        reversed = reversed * 10 + remainder;
        num /= 10;
    }
    
    printf("Reversed number = %d\\n", reversed);
    return 0;
}`
    },
    // Array Programs
    {
      id: 'c_array_sum',
      title: '11. Sum of Array Elements',
      description: 'Program to find sum of array elements',
      category: 'Arrays',
      code: `#include <stdio.h>
int main() {
    int arr[5], i, sum = 0;
    printf("Enter 5 numbers: ");
    for (i = 0; i < 5; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }
    printf("Sum of array elements = %d\\n", sum);
    return 0;
}`
    },
    {
      id: 'c_array_max',
      title: '12. Find Maximum in Array',
      description: 'Program to find maximum element in array',
      category: 'Arrays',
      code: `#include <stdio.h>
int main() {
    int arr[5], i, max;
    printf("Enter 5 numbers: ");
    scanf("%d", &arr[0]);
    max = arr[0];
    for (i = 1; i < 5; i++) {
        scanf("%d", &arr[i]);
        if (arr[i] > max)
            max = arr[i];
    }
    printf("Maximum element = %d\\n", max);
    return 0;
}`
    },
    {
      id: 'c_array_search',
      title: '13. Search Element in Array',
      description: 'Program to search for an element in array',
      category: 'Arrays',
      code: `#include <stdio.h>
int main() {
    int arr[5], i, search, found = 0;
    printf("Enter 5 numbers: ");
    for (i = 0; i < 5; i++) {
        scanf("%d", &arr[i]);
    }
    
    printf("Enter number to search: ");
    scanf("%d", &search);
    
    for (i = 0; i < 5; i++) {
        if (arr[i] == search) {
            printf("Element %d found at position %d\\n", search, i+1);
            found = 1;
            break;
        }
    }
    
    if (!found) {
        printf("Element %d not found\\n", search);
    }
    
    return 0;
}`
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white text-xl font-bold tracking-wider flex items-center space-x-2">
                <SigmaIcon className="w-6 h-6" />
                <span>SIGMA</span>
              </Link>
            </div>
            <div className="flex space-x-8">
              <Link to="/chat" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Chat
              </Link>
              <Link to="/codes" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Code
              </Link>
              <span className="text-blue-400 font-medium">C PROGRAMMING</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="pt-20 flex">
        {/* Left Sidebar - Ad */}
        <aside className="hidden lg:block w-44 bg-gray-950 border-r border-gray-800 fixed left-0 top-16 h-screen z-10">
          <div className="p-2 space-y-2 h-full overflow-hidden">
            {/* Main Ad - 160x600 */}
            <AdBanner1 className="mx-auto" />

            {/* Small Ad Below - 160x300 */}
            <AdBanner2 className="mx-auto" />
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 px-4 max-w-6xl mx-auto lg:ml-44">
        {/* Back Button */}
        <Link 
          to="/codes/vip"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to VIP Codes
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wider text-white">
            C PROGRAMMING
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Grade 11 Computer Practical Programs
          </p>
        </div>

        {/* Programs by Category */}
        <div className="space-y-12 mb-16">
          {/* Basic Programs */}
          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              Basic Programs
            </h2>
            <div className="grid gap-6">
              {cPrograms.filter(program => program.category === 'Basic Programs').map((program) => (
                <div key={program.id} className="bg-gray-900 border border-blue-500 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-400">{program.title}</h3>
                      <p className="text-gray-400 text-sm">{program.description}</p>
                    </div>
                    <button
                      onClick={() => copyCode(program.code, program.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
                    >
                      {copiedCode === program.id ? (
                        <>
                          <span className="mr-2">✓</span>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <pre className="text-green-400 text-sm whitespace-pre-wrap overflow-x-auto">
                      {program.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Loops Programs */}
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-6">
              Loops Programs
            </h2>
            <div className="grid gap-6">
              {cPrograms.filter(program => program.category === 'Loops').map((program) => (
                <div key={program.id} className="bg-gray-900 border border-purple-500 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-purple-400">{program.title}</h3>
                      <p className="text-gray-400 text-sm">{program.description}</p>
                    </div>
                    <button
                      onClick={() => copyCode(program.code, program.id)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
                    >
                      {copiedCode === program.id ? (
                        <>
                          <span className="mr-2">✓</span>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <pre className="text-green-400 text-sm whitespace-pre-wrap overflow-x-auto">
                      {program.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Arrays Programs */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              Arrays Programs
            </h2>
            <div className="grid gap-6">
              {cPrograms.filter(program => program.category === 'Arrays').map((program) => (
                <div key={program.id} className="bg-gray-900 border border-cyan-500 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-cyan-400">{program.title}</h3>
                      <p className="text-gray-400 text-sm">{program.description}</p>
                    </div>
                    <button
                      onClick={() => copyCode(program.code, program.id)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
                    >
                      {copiedCode === program.id ? (
                        <>
                          <span className="mr-2">✓</span>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <pre className="text-green-400 text-sm whitespace-pre-wrap overflow-x-auto">
                      {program.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs text-gray-500 font-light">Made By OG Rusil</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CProgramming;
export { VipCodes };
