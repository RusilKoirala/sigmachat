import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from './components/SigmaIcon.jsx';

const HTMLProgramming = () => {
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

  // HTML Programs
  const htmlPrograms = [
    // Basic HTML
    {
      id: 'html_basic_page',
      title: '1. Basic HTML Page',
      description: 'Complete HTML page with headings, paragraphs, lists',
      category: 'Basic HTML',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <h2>About Me</h2>
    <p>This is a paragraph about myself.</p>
    
    <h3>My Hobbies</h3>
    <ul>
        <li>Reading books</li>
        <li>Playing games</li>
        <li>Coding</li>
    </ul>
    
    <h3>My Subjects</h3>
    <ol>
        <li>Mathematics</li>
        <li>Computer Science</li>
        <li>Physics</li>
    </ol>
    
    <p>Contact me at: <a href="mailto:student@email.com">student@email.com</a></p>
    <img src="photo.jpg" alt="My Photo" width="200">
    
    <hr>
    <footer>
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
</body>
</html>`
    },
    {
      id: 'html_headings',
      title: '2. HTML Headings Example',
      description: 'Demonstration of all HTML heading tags',
      category: 'Basic HTML',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>HTML Headings</title>
</head>
<body>
    <h1>This is Heading 1</h1>
    <h2>This is Heading 2</h2>
    <h3>This is Heading 3</h3>
    <h4>This is Heading 4</h4>
    <h5>This is Heading 5</h5>
    <h6>This is Heading 6</h6>
    
    <p>Headings are used to create hierarchy in your content.</p>
    <p>H1 is the largest and most important, H6 is the smallest.</p>
</body>
</html>`
    },
    {
      id: 'html_links_images',
      title: '3. Links and Images',
      description: 'HTML page with various links and images',
      category: 'Basic HTML',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>Links and Images</title>
</head>
<body>
    <h1>Links and Images Example</h1>
    
    <h2>Different Types of Links</h2>
    <p><a href="https://www.google.com">Visit Google</a></p>
    <p><a href="mailto:someone@email.com">Send Email</a></p>
    <p><a href="tel:+1234567890">Call Us</a></p>
    <p><a href="#section1">Go to Section 1</a></p>
    
    <h2>Images</h2>
    <img src="image1.jpg" alt="Sample Image" width="300" height="200">
    <br><br>
    <img src="image2.png" alt="Another Image" width="250">
    
    <h2 id="section1">Section 1</h2>
    <p>This is section 1 content. You can link to this section using anchors.</p>
</body>
</html>`
    },
    // Forms
    {
      id: 'html_basic_form',
      title: '4. Basic HTML Form',
      description: 'Simple form with text inputs and buttons',
      category: 'Forms',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>Basic Form</title>
</head>
<body>
    <h1>Contact Form</h1>
    
    <form action="#" method="post">
        <p>
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" required>
        </p>
        
        <p>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required>
        </p>
        
        <p>
            <label for="message">Message:</label><br>
            <textarea id="message" name="message" rows="4" cols="50"></textarea>
        </p>
        
        <p>
            <input type="submit" value="Send Message">
            <input type="reset" value="Clear Form">
        </p>
    </form>
</body>
</html>`
    },
    {
      id: 'html_student_form',
      title: '5. Student Registration Form',
      description: 'Complete form with all input types',
      category: 'Forms',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>Student Registration</title>
</head>
<body>
    <h1>Student Registration Form</h1>
    
    <form action="#" method="post">
        <fieldset>
            <legend>Personal Information</legend>
            
            <p>
                <label for="fname">First Name:</label>
                <input type="text" id="fname" name="firstname" required>
            </p>
            
            <p>
                <label for="lname">Last Name:</label>
                <input type="text" id="lname" name="lastname" required>
            </p>
            
            <p>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </p>
            
            <p>
                <label for="age">Age:</label>
                <input type="number" id="age" name="age" min="15" max="25">
            </p>
            
            <p>
                Gender:
                <input type="radio" id="male" name="gender" value="male">
                <label for="male">Male</label>
                <input type="radio" id="female" name="gender" value="female">
                <label for="female">Female</label>
            </p>
        </fieldset>
        
        <fieldset>
            <legend>Academic Information</legend>
            
            <p>
                <label for="class">Class:</label>
                <select id="class" name="class">
                    <option value="">Select Class</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                </select>
            </p>
            
            <p>
                Subjects:
                <input type="checkbox" id="math" name="subjects" value="math">
                <label for="math">Mathematics</label>
                <input type="checkbox" id="science" name="subjects" value="science">
                <label for="science">Science</label>
                <input type="checkbox" id="computer" name="subjects" value="computer">
                <label for="computer">Computer</label>
            </p>
        </fieldset>
        
        <p>
            <input type="submit" value="Register">
            <input type="reset" value="Clear All">
        </p>
    </form>
</body>
</html>`
    },
    // Tables
    {
      id: 'html_basic_table',
      title: '6. Basic HTML Table',
      description: 'Simple table with student data',
      category: 'Tables',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>Student Marks Table</title>
</head>
<body>
    <h1>Student Marks</h1>
    
    <table border="1">
        <tr>
            <th>Student Name</th>
            <th>Math</th>
            <th>Science</th>
            <th>Computer</th>
            <th>Total</th>
        </tr>
        <tr>
            <td>John Smith</td>
            <td>85</td>
            <td>90</td>
            <td>95</td>
            <td>270</td>
        </tr>
        <tr>
            <td>Jane Doe</td>
            <td>88</td>
            <td>92</td>
            <td>89</td>
            <td>269</td>
        </tr>
        <tr>
            <td>Mike Johnson</td>
            <td>92</td>
            <td>87</td>
            <td>94</td>
            <td>273</td>
        </tr>
        <tr>
            <td>Sarah Wilson</td>
            <td>79</td>
            <td>85</td>
            <td>91</td>
            <td>255</td>
        </tr>
    </table>
</body>
</html>`
    },
    {
      id: 'html_advanced_table',
      title: '7. Advanced Table with Styling',
      description: 'Table with colspan, rowspan and styling',
      category: 'Tables',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>Advanced Table</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
        .total { background-color: #e6f3ff; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Class 11 Exam Results</h1>
    
    <table>
        <tr>
            <th rowspan="2">Student Name</th>
            <th colspan="3">Subjects</th>
            <th rowspan="2">Total</th>
            <th rowspan="2">Grade</th>
        </tr>
        <tr>
            <th>Math</th>
            <th>Science</th>
            <th>Computer</th>
        </tr>
        <tr>
            <td>John Smith</td>
            <td>85</td>
            <td>90</td>
            <td>95</td>
            <td class="total">270</td>
            <td>A</td>
        </tr>
        <tr>
            <td>Jane Doe</td>
            <td>88</td>
            <td>92</td>
            <td>89</td>
            <td class="total">269</td>
            <td>A</td>
        </tr>
        <tr>
            <td>Mike Johnson</td>
            <td>92</td>
            <td>87</td>
            <td>94</td>
            <td class="total">273</td>
            <td>A</td>
        </tr>
        <tr>
            <td colspan="4">Class Average</td>
            <td class="total">270.7</td>
            <td>A</td>
        </tr>
    </table>
</body>
</html>`
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
              <span className="text-orange-400 font-medium">HTML PROGRAMMING</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 max-w-6xl mx-auto">
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
            HTML PROGRAMMING
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Grade 11 Web Development Programs
          </p>
        </div>

        {/* Programs by Category */}
        <div className="space-y-12 mb-16">
          {/* Basic HTML */}
          <section>
            <h2 className="text-2xl font-bold text-orange-400 mb-6">
              Basic HTML
            </h2>
            <div className="grid gap-6">
              {htmlPrograms.filter(program => program.category === 'Basic HTML').map((program) => (
                <div key={program.id} className="bg-gray-900 border border-orange-500 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-orange-400">{program.title}</h3>
                      <p className="text-gray-400 text-sm">{program.description}</p>
                    </div>
                    <button
                      onClick={() => copyCode(program.code, program.id)}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
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
                    <pre className="text-orange-400 text-sm whitespace-pre-wrap overflow-x-auto">
                      {program.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Forms */}
          <section>
            <h2 className="text-2xl font-bold text-green-400 mb-6">
              HTML Forms
            </h2>
            <div className="grid gap-6">
              {htmlPrograms.filter(program => program.category === 'Forms').map((program) => (
                <div key={program.id} className="bg-gray-900 border border-green-500 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-green-400">{program.title}</h3>
                      <p className="text-gray-400 text-sm">{program.description}</p>
                    </div>
                    <button
                      onClick={() => copyCode(program.code, program.id)}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors flex items-center"
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
                    <pre className="text-orange-400 text-sm whitespace-pre-wrap overflow-x-auto">
                      {program.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tables */}
          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              HTML Tables
            </h2>
            <div className="grid gap-6">
              {htmlPrograms.filter(program => program.category === 'Tables').map((program) => (
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
                    <pre className="text-orange-400 text-sm whitespace-pre-wrap overflow-x-auto">
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
  );
};

export default HTMLProgramming;
