import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from './components/SigmaIcon.jsx';
import { AdBanner1, AdBanner2 } from './components/AdManager.jsx';

const BhaiLang = () => {
  const [selectedExample, setSelectedExample] = useState('hello');
  const [code, setCode] = useState(`hi bhai
bol bhai "Hello World!";
bye bhai`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [bhaiLang, setBhaiLang] = useState(null);
  const outputRef = useRef(null);

  // Load BhaiLang interpreter
  useEffect(() => {
    // Create a browser-compatible Bhai Lang interpreter
    const bhaiInterpreter = {
      run(code) {
        try {
          return this.interpret(code);
        } catch (error) {
          throw error;
        }
      },

      interpret(code) {
        const lines = code.split('\n');
        let output = '';
        let variables = {};
        let functions = {};

        // Parse and execute line by line
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Skip empty lines, comments, and program markers
          if (!line || line.startsWith('//') || line === 'hi bhai' || line === 'bye bhai') {
            continue;
          }

          try {
            const result = this.executeLine(line, variables, functions, lines, i);
            if (result.output) {
              output += result.output + '\n';
            }
            if (result.jump !== undefined) {
              i = result.jump;
            }
          } catch (error) {
            throw new Error(`Line ${i + 1}: ${error.message}`);
          }
        }

        return output;
      },

      executeLine(line, variables, functions, allLines, currentIndex) {
        // Handle print statements: bol bhai
        if (line.includes('bol bhai')) {
          const match = line.match(/bol bhai\s+(.+);?/);
          if (match) {
            let value = match[1].trim();
            if (value.endsWith(';')) value = value.slice(0, -1).trim();

            const result = this.evaluateExpression(value, variables);
            return { output: result };
          }
        }

        // Handle variable declarations: bhai ye hai
        if (line.includes('bhai ye hai')) {
          const match = line.match(/bhai ye hai\s+(\w+)\s*=\s*(.+);?/);
          if (match) {
            const varName = match[1];
            let varValue = match[2].trim();
            if (varValue.endsWith(';')) varValue = varValue.slice(0, -1).trim();

            variables[varName] = this.evaluateExpression(varValue, variables);
            return {};
          }
        }

        // Handle if statements: agar bhai
        if (line.includes('agar bhai')) {
          const match = line.match(/agar bhai\s*\((.+)\)\s*\{/);
          if (match) {
            const condition = match[1].trim();
            const conditionResult = this.evaluateExpression(condition, variables);

            // Find the matching closing brace
            let braceCount = 1;
            let endIndex = currentIndex;

            for (let j = currentIndex + 1; j < allLines.length && braceCount > 0; j++) {
              const checkLine = allLines[j].trim();
              if (checkLine.includes('{')) braceCount++;
              if (checkLine.includes('}')) braceCount--;
              endIndex = j;
            }

            if (conditionResult) {
              // Execute if block
              let blockOutput = '';
              for (let j = currentIndex + 1; j < endIndex; j++) {
                const blockLine = allLines[j].trim();
                if (blockLine && !blockLine.includes('}') && !blockLine.includes('warna bhai')) {
                  const blockResult = this.executeLine(blockLine, variables, functions, allLines, j);
                  if (blockResult.output) {
                    blockOutput += blockResult.output + '\n';
                  }
                }
              }
              return { jump: endIndex, output: blockOutput.trim() };
            }

            return { jump: endIndex };
          }
        }

        // Handle while loops: jab tak bhai
        if (line.includes('jab tak bhai')) {
          const match = line.match(/jab tak bhai\s*\((.+)\)\s*\{/);
          if (match) {
            const condition = match[1].trim();

            // Find the matching closing brace
            let braceCount = 1;
            let endIndex = currentIndex;

            for (let j = currentIndex + 1; j < allLines.length && braceCount > 0; j++) {
              const checkLine = allLines[j].trim();
              if (checkLine.includes('{')) braceCount++;
              if (checkLine.includes('}')) braceCount--;
              endIndex = j;
            }

            let iterations = 0;
            let loopOutput = '';
            while (this.evaluateExpression(condition, variables) && iterations < 1000) {
              // Execute loop body
              for (let j = currentIndex + 1; j < endIndex; j++) {
                const blockLine = allLines[j].trim();
                if (blockLine && !blockLine.includes('}')) {
                  const blockResult = this.executeLine(blockLine, variables, functions, allLines, j);
                  if (blockResult.output !== undefined && blockResult.output !== '') {
                    loopOutput += blockResult.output + '\n';
                  }
                }
              }
              iterations++;
            }

            return { jump: endIndex, output: loopOutput.trim() };
          }
        }

        // Handle variable assignments
        if (line.includes('=') && !line.includes('bhai ye hai')) {
          const match = line.match(/(\w+)\s*=\s*(.+);?/);
          if (match) {
            const varName = match[1];
            let varValue = match[2].trim();
            if (varValue.endsWith(';')) varValue = varValue.slice(0, -1).trim();

            variables[varName] = this.evaluateExpression(varValue, variables);
            return {};
          }
        }

        return {};
      },

      evaluateExpression(expr, variables) {
        expr = expr.trim();

        // Handle string literals
        if (expr.startsWith('"') && expr.endsWith('"')) {
          return expr.slice(1, -1);
        }

        // Handle boolean literals
        if (expr === 'sahi') return true;
        if (expr === 'galat') return false;
        if (expr === 'nalla') return null;

        // Handle numbers
        if (!isNaN(expr) && !isNaN(parseFloat(expr))) {
          return parseFloat(expr);
        }

        // Handle variables
        if (variables.hasOwnProperty(expr)) {
          return variables[expr];
        }

        // Handle string concatenation (only if it contains quotes or string variables)
        if (expr.includes('+') && (expr.includes('"') || this.hasStringVariable(expr, variables))) {
          const parts = expr.split('+').map(p => p.trim());
          let result = '';
          for (const part of parts) {
            const value = this.evaluateExpression(part, variables);
            result += String(value);
          }
          return result;
        }

        // Handle comparisons
        if (expr.includes('>=')) {
          const [left, right] = expr.split('>=').map(p => p.trim());
          return this.evaluateExpression(left, variables) >= this.evaluateExpression(right, variables);
        }
        if (expr.includes('<=')) {
          const [left, right] = expr.split('<=').map(p => p.trim());
          return this.evaluateExpression(left, variables) <= this.evaluateExpression(right, variables);
        }
        if (expr.includes('>')) {
          const [left, right] = expr.split('>').map(p => p.trim());
          return this.evaluateExpression(left, variables) > this.evaluateExpression(right, variables);
        }
        if (expr.includes('<')) {
          const [left, right] = expr.split('<').map(p => p.trim());
          return this.evaluateExpression(left, variables) < this.evaluateExpression(right, variables);
        }
        if (expr.includes('==')) {
          const [left, right] = expr.split('==').map(p => p.trim());
          return this.evaluateExpression(left, variables) == this.evaluateExpression(right, variables);
        }

        // Handle arithmetic operations
        if (expr.includes(' + ')) {
          const [left, right] = expr.split(' + ').map(p => p.trim());
          return this.evaluateExpression(left, variables) + this.evaluateExpression(right, variables);
        }
        if (expr.includes(' - ')) {
          const [left, right] = expr.split(' - ').map(p => p.trim());
          return this.evaluateExpression(left, variables) - this.evaluateExpression(right, variables);
        }

        return expr;
      },

      hasStringVariable(expr, variables) {
        const parts = expr.split('+').map(p => p.trim());
        for (const part of parts) {
          if (variables.hasOwnProperty(part) && typeof variables[part] === 'string') {
            return true;
          }
        }
        return false;
      }
    };

    setBhaiLang(bhaiInterpreter);
    console.log('BhaiLang interpreter loaded successfully!');
  }, []);

  const examples = {
    hello: {
      title: "Hello World",
      code: `hi bhai
bol bhai "Hello World!";
bye bhai`,
      description: "Basic hello world program in Bhai Lang"
    },
    variables: {
      title: "Variables",
      code: `hi bhai
bhai ye hai x = 5;
bhai ye hai name = "Rusil";
bol bhai x;
bol bhai name;
bye bhai`,
      description: "Declaring and using variables"
    },
    conditions: {
      title: "Conditions",
      code: `hi bhai
bhai ye hai age = 18;
agar bhai (age >= 18) {
    bol bhai "You can vote!";
} warna bhai {
    bol bhai "Too young to vote";
}
bye bhai`,
      description: "If-else conditions in Bhai Lang"
    },
    loops: {
      title: "Loops",
      code: `hi bhai
bhai ye hai i = 0;
jab tak bhai (i < 5) {
    bol bhai i;
    i = i + 1;
}
bye bhai`,
      description: "While loop example"
    },
    functions: {
      title: "Functions",
      code: `hi bhai
kaam kar bhai greet(name) {
    bol bhai "Hello " + name;
}

greet("Bhai");
bye bhai`,
      description: "Function declaration and calling"
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const loadExample = (exampleKey) => {
    setSelectedExample(exampleKey);
    setCode(examples[exampleKey].code);
    setOutput('');
  };

  const runCode = async () => {
    if (!bhaiLang) {
      setOutput('Error: BhaiLang interpreter not loaded yet. Please wait...');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...');

    try {
      // Execute BhaiLang code
      const result = bhaiLang.run(code);

      // Set the output
      setOutput(result || 'Code executed successfully! (No output)');

    } catch (error) {
      // Handle execution errors
      let errorMessage = error.message || error.toString();
      setOutput(`Error: ${errorMessage}`);
    }

    setIsRunning(false);
  };

  const clearOutput = () => {
    setOutput('');
  };

  const handleKeyDown = (e) => {
    // Run code on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="bg-black border-b border-gray-800 fixed top-0 left-0 right-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
            <SigmaIcon className="w-8 h-8" />
            <span className="font-bold text-xl">SIGMA</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/chat" className="hover:text-gray-300 transition-colors">Chat</Link>
            <Link to="/codes" className="hover:text-gray-300 transition-colors">Codes</Link>
            <Link to="/bhailang" className="text-orange-400 font-medium">Bhai Lang</Link>
          </div>
        </div>
      </nav>

      {/* Responsive Main Content with Sidebar */}
      <div className="pt-20 flex flex-col lg:flex-row">
        {/* Responsive Ad Sidebar */}
        <aside className="w-full lg:w-44 xl:w-48 bg-gray-950 border-b lg:border-b-0 lg:border-r border-gray-800 lg:min-h-screen">
          <div className="sticky top-20 p-2 lg:space-y-2 max-h-screen overflow-hidden flex flex-row lg:flex-col gap-2 lg:gap-0 justify-center lg:justify-start">
            {/* Main Ad - Responsive */}
            <div className="w-1/2 lg:w-full">
              <AdBanner1 className="mx-auto" show={true} />
            </div>

            {/* Small Ad Below - Responsive */}
            <div className="w-1/2 lg:w-full">
              <AdBanner2 className="mx-auto" show={true} />
            </div>
          </div>
        </aside>

        {/* Content Area - Responsive */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto lg:max-w-none lg:ml-0">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Bhai Lang Playground
            </h1>
            <p className="text-lg text-gray-400 mb-4">
              Write and run Bhai Lang code in your browser!
            </p>
          </div>

          {/* Playground Section */}
          <section className="mb-8 lg:mb-12">
            <div className="w-full">
              {/* Example Selector */}
              <div className="mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold mb-3 text-center">Load Example:</h3>
                <div className="flex flex-wrap justify-center gap-1 lg:gap-2 px-2">
                  {Object.entries(examples).map(([key, example]) => (
                    <button
                      key={key}
                      onClick={() => loadExample(key)}
                      className={`px-2 lg:px-3 py-1 rounded-lg font-medium transition-colors text-xs lg:text-sm ${
                        selectedExample === key
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {example.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor and Output */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Code Editor */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-orange-400 text-sm lg:text-base">Code Editor</h3>
                    <div className="flex gap-1 lg:gap-2">
                      <button
                        onClick={() => copyToClipboard(code)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm transition-colors"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => setCode('')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="p-2 lg:p-4">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-64 lg:h-80 bg-black text-orange-300 font-mono text-xs lg:text-sm p-2 lg:p-4 rounded border border-gray-600 focus:border-orange-500 focus:outline-none resize-none"
                      placeholder="Write your Bhai Lang code here..."
                      spellCheck={false}
                    />
                  </div>
                  <div className="bg-gray-800 px-3 lg:px-4 py-2 lg:py-3 border-t border-gray-700">
                    <button
                      onClick={runCode}
                      disabled={isRunning || !bhaiLang}
                      className={`w-full py-2 px-4 rounded font-medium transition-colors text-sm lg:text-base ${
                        isRunning || !bhaiLang
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {!bhaiLang ? 'Loading Interpreter...' : isRunning ? 'Running...' : 'Run Code'}
                    </button>
                  </div>
                </div>

                {/* Output */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-green-400 text-sm lg:text-base">Output</h3>
                    <button
                      onClick={clearOutput}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="p-2 lg:p-4">
                    <div
                      ref={outputRef}
                      className="w-full h-64 lg:h-80 bg-black text-green-300 font-mono text-xs lg:text-sm p-2 lg:p-4 rounded border border-gray-600 overflow-y-auto whitespace-pre-wrap"
                    >
                      {output || 'Output will appear here...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Reference */}
          <section className="mb-8 lg:mb-12">
            <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-center">Quick Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 lg:p-4">
                <h3 className="text-base lg:text-lg font-bold text-orange-400 mb-2 lg:mb-3">Basic Commands</h3>
                <div className="space-y-1 text-xs lg:text-sm">
                  <div><code className="text-orange-300">hi bhai</code> - Start</div>
                  <div><code className="text-orange-300">bye bhai</code> - End</div>
                  <div><code className="text-orange-300">bol bhai</code> - Print</div>
                  <div><code className="text-orange-300">bhai ye hai</code> - Variable</div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 lg:p-4">
                <h3 className="text-base lg:text-lg font-bold text-orange-400 mb-2 lg:mb-3">Control Flow</h3>
                <div className="space-y-1 text-xs lg:text-sm">
                  <div><code className="text-blue-300">agar bhai</code> - If</div>
                  <div><code className="text-blue-300">warna bhai</code> - Else</div>
                  <div><code className="text-blue-300">jab tak bhai</code> - While</div>
                  <div><code className="text-blue-300">kaam kar bhai</code> - Function</div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 lg:p-4">
                <h3 className="text-base lg:text-lg font-bold text-orange-400 mb-2 lg:mb-3">Values</h3>
                <div className="space-y-1 text-xs lg:text-sm">
                  <div><code className="text-green-300">sahi</code> - true</div>
                  <div><code className="text-green-300">galat</code> - false</div>
                  <div><code className="text-yellow-300">"text"</code> - String</div>
                  <div><code className="text-yellow-300">42</code> - Number</div>
                </div>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="mb-8 lg:mb-12">
            <div className="text-center">
              <h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">Learn More</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-3 lg:gap-4 px-4">
                <a
                  href="https://github.com/DulLabs/bhai-lang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
                >
                  GitHub Repo
                </a>
                <a
                  href="https://bhailang.js.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
                >
                  Official Site
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-xs text-gray-500 font-light">
              Bhai Lang by DulLabs (NOT ME)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BhaiLang;
