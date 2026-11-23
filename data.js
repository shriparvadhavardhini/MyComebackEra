/* =========================================================
   data.js - ALL roadmap content lives here (not in the UI).
   Format: M(moduleName, level, "topic,topic,Parent[sub/sub/sub]")
   - Topics are separated by commas.
   - A topic followed by [a/b/c] has expandable subtopics.
   - Level: B = Beginner, I = Intermediate, A = Advanced
   The parser at the bottom turns these strings into objects.
   ========================================================= */
const M = (name, level, list) => ({ name, level, list });

const SUBJECTS = [
{ id: 'py', name: 'Python Programming', icon: '🐍', modules: [
 M('Introduction', 'B', 'What is Python?,History and features of Python,Python applications,Python interpreter,Python installation on Windows,Installing Python extensions in VS Code,Python interpreter selection,Running Python programs,Interactive mode vs script mode,Python syntax,Indentation,Comments,Keywords,Identifiers,Naming conventions'),
 M('Variables and Data Types', 'B', 'Variables,Variable declaration and assignment,Multiple variable assignment,Constants,Built-in data types[Integer/Float/Complex numbers/Boolean/String/None type],Type checking using type(),Type conversion[Implicit conversion/Explicit conversion],Mutable vs immutable objects,Dynamic typing'),
 M('Input, Output and Operators', 'B', 'print(),input(),Output formatting,f-strings,Arithmetic operators,Comparison operators,Logical operators,Assignment operators,Bitwise operators,Membership operators,Identity operators,Operator precedence'),
 M('Strings', 'B', 'String creation,String indexing[Positive indexing/Negative indexing],String slicing,String concatenation,String repetition,String immutability,String methods[strip()/split()/join()/replace()/find()/count()/startswith()/endswith()/upper()/lower()/title()/capitalize()],String formatting,Escape characters'),
 M('Collections', 'I', 'Introduction to collections,Lists[List creation/List indexing/List slicing/Adding list elements/append()/insert()/extend()/Removing elements/remove()/pop()/del/List sorting/sort()/sorted()/reverse()/List copying/Nested lists/List comprehensions],Tuples[Tuple indexing/Tuple slicing/Tuple packing/Tuple unpacking/Tuple methods],Sets[Set creation/Unique elements/add()/update()/remove()/discard()/Union/Intersection/Difference/Symmetric difference/Set comprehension],Dictionaries[Key-value pairs/Dictionary creation/Accessing values/Adding keys/Updating values/Removing keys/keys()/values()/items()/get()/update()/pop()/Nested dictionaries/Dictionary comprehension]'),
 M('Conditional Statements and Loops', 'B', 'if statement,if-else,if-elif-else,Nested conditions,Conditional expressions,for loop,while loop,Nested loops,range(),break,continue,pass,Loop else,Pattern printing'),
 M('Functions', 'I', 'What is a function?,Built-in functions,User-defined functions,Defining a function,Calling a function,Parameters,Arguments,Positional arguments,Keyword arguments,Default arguments,Variable-length arguments[*args/**kwargs],Return statement,Multiple return values,Scope[Local variables/Global variables/global keyword/nonlocal keyword],Lambda functions,Recursion,Higher-order functions[map()/filter()/reduce()],Function annotations'),
 M('Modules and Packages', 'I', 'What is a module?,Import statement[import/from import/Aliases],Built-in modules[math/random/datetime/os/sys],Creating custom modules,What is a package?,Package structure,pip,Installing packages,Virtual environments,requirements.txt'),
 M('File Handling', 'I', 'File concepts,File paths,Opening files,open(),File modes,Reading files[read()/readline()/readlines()],Writing files[write()/writelines()],Appending,with statement,Closing files,CSV files,JSON files,File exceptions'),
 M('Exception Handling', 'I', 'Errors vs exceptions,Syntax errors,Runtime errors,try,except,Multiple except blocks,else,finally,raise,Custom exceptions'),
 M('Object-Oriented Programming', 'A', 'OOP concepts,Classes,Objects,Attributes,Methods,Constructor,__init__,self,Instance variables,Class variables,Instance methods,Class methods,Static methods,Encapsulation,Abstraction,Inheritance[Single inheritance/Multiple inheritance/Multilevel inheritance/Hierarchical inheritance/Hybrid inheritance],Polymorphism,Method overriding,Method overloading concepts,super(),Getters and setters,Properties,Magic methods[__str__/__repr__/__len__]'),
 M('Advanced Python', 'A', 'Iterables,Iterators,next(),iter(),Generators,yield,Generator expressions,Decorators,Closures,Context managers,Enumerate,Zip,Any,All,Sorting with key,Shallow copy,Deep copy,Python memory basics,Garbage collection basics'),
 M('Python Interview Practice', 'A', 'Reverse a string,Palindrome check,Count vowels,Character frequency,Remove duplicates,Find maximum and minimum,Find second-largest number,Sort a list,Find missing numbers,Fibonacci series,Factorial,Prime number check,Armstrong number,Anagram check,FizzBuzz,Two sum,Merge lists,Basic pattern programs')
]},

{ id: 'sql', name: 'SQL & Databases', icon: '🗄️', modules: [
 M('Database Fundamentals', 'B', 'Data,Information,Database,DBMS,RDBMS,Database architecture,Database schemas,Tables,Rows,Columns,Attributes,Records,Data types,NULL values'),
 M('Keys and Constraints', 'B', 'Primary key,Foreign key,Candidate key,Super key,Alternate key,Composite key,Unique constraint,NOT NULL,CHECK,DEFAULT,Referential integrity'),
 M('SQL Commands', 'B', 'DDL[CREATE/ALTER/DROP/TRUNCATE],DML[INSERT/UPDATE/DELETE],DQL[SELECT],DCL[GRANT/REVOKE],TCL[COMMIT/ROLLBACK/SAVEPOINT]'),
 M('Querying', 'B', 'SELECT,DISTINCT,WHERE,AND,OR,NOT,IN,BETWEEN,LIKE,Wildcards,IS NULL,ORDER BY,ASC,DESC,LIMIT,OFFSET,Aliases'),
 M('Functions', 'I', 'COUNT,SUM,AVG,MIN,MAX,UPPER,LOWER,LENGTH,CONCAT,SUBSTRING,TRIM,ROUND,ABS,CEIL,FLOOR,NOW,Date functions'),
 M('Grouping', 'I', 'GROUP BY,HAVING,Aggregate functions,Grouping multiple columns'),
 M('Joins', 'I', 'INNER JOIN,LEFT JOIN,RIGHT JOIN,FULL OUTER JOIN,CROSS JOIN,SELF JOIN,Joining multiple tables,Join conditions'),
 M('Advanced Queries', 'A', 'Subqueries[Single-row subqueries/Multiple-row subqueries/Nested subqueries/Correlated subqueries],EXISTS,NOT EXISTS,ANY,ALL,CASE,UNION,UNION ALL,INTERSECT,MINUS/EXCEPT'),
 M('Database Design', 'I', 'ER models,Entities,Attributes (ER),Relationships,Cardinality,ER diagrams,Normalization[1NF/2NF/3NF/BCNF],Functional dependencies,Denormalization'),
 M('Advanced Database Concepts', 'A', 'Views,Indexes[Clustered indexes/Non-clustered indexes],Stored procedures,Functions (user-defined),Triggers,Cursors,Transactions,ACID,Isolation levels,Deadlocks,Query optimization,Execution plans'),
 M('Practice', 'A', 'Create databases,Create tables,Design relationships,CRUD queries,Multi-table joins,Aggregation practice,Subquery problems,Interview query challenges')
]},

{ id: 'ds', name: 'Data Science', icon: '📊', modules: [
 M('Foundations', 'B', 'Introduction to data science,Data science lifecycle,Data science vs data analytics,Data science vs machine learning,Types of data[Structured data/Semi-structured data/Unstructured data]'),
 M('Data Collection and Cleaning', 'B', 'Data collection,Data sources,Data acquisition,Data cleaning[Missing values/Duplicate records/Inconsistent data/Outlier detection],Data preprocessing,Data transformation,Categorical data,Numerical data,Label encoding,One-hot encoding,Feature engineering,Feature selection'),
 M('NumPy', 'I', 'NumPy introduction,NumPy arrays,Array creation,Array indexing,Array slicing,Array reshaping,Array operations,Broadcasting'),
 M('Pandas', 'I', 'Pandas introduction,Series,DataFrames,Reading CSV,Reading Excel,DataFrame indexing,Data selection,Filtering,Sorting,Adding columns,Removing columns,Missing data handling[fillna/dropna],GroupBy,Merge,Join,Concatenate,Pivot tables'),
 M('Statistics and Probability', 'I', 'Descriptive statistics,Mean,Median,Mode,Range,Variance,Standard deviation,Quartiles,IQR,Probability basics,Random variables,Normal distribution,Correlation,Covariance'),
 M('Exploratory Data Analysis', 'I', 'Exploratory data analysis,Univariate analysis,Bivariate analysis,Multivariate analysis'),
 M('Visualization', 'I', 'Matplotlib,Line plots,Bar charts,Histograms,Scatter plots,Pie charts,Box plots,Seaborn,Heatmaps,Pair plots,Data storytelling,Dashboard basics'),
 M('Projects', 'A', 'Data analysis projects')
]},

{ id: 'ml', name: 'Machine Learning', icon: '🤖', modules: [
 M('ML Fundamentals', 'B', 'Artificial intelligence,Machine learning,Deep learning,AI vs ML vs DL,Applications of ML,ML workflow,Types of ML[Supervised learning/Unsupervised learning/Reinforcement learning],Regression,Classification,Clustering,Training data,Testing data,Validation data,Features,Labels'),
 M('Data Preparation', 'B', 'Data preprocessing,Missing values,Outlier handling,Encoding[Label encoding/One-hot encoding],Feature scaling[Normalization/Standardization],Train-test split,Cross-validation'),
 M('Regression and Classification', 'I', 'Linear regression[Simple linear regression/Multiple linear regression],Polynomial regression,Logistic regression,K-nearest neighbors,Decision trees,Random forests,Support vector machines,Naive Bayes,Gradient boosting,XGBoost basics'),
 M('Unsupervised Learning', 'I', 'K-means clustering,Hierarchical clustering,DBSCAN basics,PCA,Feature selection'),
 M('Model Quality', 'I', 'Overfitting,Underfitting,Bias,Variance,Bias-variance tradeoff,Regularization[L1/L2]'),
 M('Model Evaluation', 'I', 'Model evaluation,Accuracy,Precision,Recall,F1 score,Confusion matrix,ROC,AUC,MAE,MSE,RMSE,R-squared'),
 M('Tuning and Deployment', 'A', 'Hyperparameters,Grid search,Random search,Model pipelines,Scikit-learn,Model deployment basics'),
 M('Projects and Interviews', 'A', 'ML projects,ML interview questions')
]},

{ id: 'dl', name: 'Deep Learning & Generative AI', icon: '🧠', modules: [
 M('Foundations', 'B', 'AI fundamentals,Machine learning recap,Deep learning fundamentals,Neural networks,Biological neuron concept,Artificial neuron,Perceptron,Input layer,Hidden layer,Output layer,Weights,Biases'),
 M('Activations and Loss', 'I', 'Activation functions[Sigmoid/Tanh/ReLU/Softmax],Forward propagation,Loss functions[Binary cross-entropy/Categorical cross-entropy/Mean squared error]'),
 M('Training Neural Networks', 'I', 'Backpropagation,Gradient descent,Stochastic gradient descent,Mini-batch gradient descent,Learning rate,Epochs,Batch size,Optimizers[Adam/RMSprop],Neural network training,Overfitting,Dropout,Regularization,Batch normalization'),
 M('CNN and Sequence Models', 'I', 'CNN,Convolution,Filters,Pooling,Image classification,RNN,LSTM,GRU'),
 M('NLP', 'I', 'NLP fundamentals,Text preprocessing,Tokenization,Stemming,Lemmatization,Word embeddings'),
 M('Transformers and LLMs', 'A', 'Transformers,Attention,Self-attention,Positional encoding,Encoder,Decoder,Large language models,GPT architecture basics'),
 M('Generative AI', 'A', 'Generative AI,Tokens,Tokenization in LLMs,Context windows,Temperature,Top-k,Top-p,Prompt engineering,Zero-shot prompting,Few-shot prompting,Chain-of-thought concepts,System prompts,AI APIs'),
 M('RAG and Fine-tuning', 'A', 'Embeddings,Vector search,Vector databases,RAG,Document chunking,Retrieval,Fine-tuning,LoRA concepts'),
 M('Agents, Safety and Projects', 'A', 'AI agents,Tool calling,Agent workflows,AI safety,Hallucinations,Evaluation,Generative AI projects')
]},

{ id: 'dsa', name: 'Data Structures & Algorithms', icon: '🧩', modules: [
 M('Complexity', 'B', 'What is an algorithm?,Time complexity,Space complexity,Big O,Big Omega,Big Theta,Constant time,Logarithmic time,Linear time,Linearithmic time,Quadratic time'),
 M('Data Structures', 'B', 'Arrays,Array operations,Strings,Two-dimensional arrays,Linked lists[Singly linked lists/Doubly linked lists/Circular linked lists],Stack[Stack operations],Queue[Circular queue/Deque/Priority queue],Hashing[Hash tables/Hash collisions],Sets,Dictionaries'),
 M('Searching', 'B', 'Linear search,Binary search,Binary search variations'),
 M('Sorting', 'I', 'Bubble sort,Selection sort,Insertion sort,Merge sort,Quick sort,Heap sort,Counting sort basics'),
 M('Trees', 'I', 'Tree terminology,Binary trees,Tree traversals[Preorder/Inorder/Postorder/Level order],Binary search trees[BST insertion/BST deletion],Heaps[Min heap/Max heap]'),
 M('Graphs', 'A', 'Graph terminology,Directed graphs,Undirected graphs,Weighted graphs,Graph representation[Adjacency matrix/Adjacency list],BFS,DFS,Cycle detection,Shortest path,Dijkstra basics'),
 M('Problem-solving Patterns', 'A', 'Recursion,Backtracking,Greedy algorithms,Two pointers,Sliding window,Prefix sums,Divide and conquer,Dynamic programming[Memoization/Tabulation]'),
 M('Coding Practice', 'A', 'Practice: Arrays,Practice: Strings,Practice: Searching,Practice: Sorting,Practice: Hashing,Practice: Linked lists,Practice: Stack,Practice: Queue,Practice: Trees,Practice: Graphs,Practice: Recursion,Practice: Greedy,Practice: Dynamic programming')
]},

{ id: 'cloud', name: 'Cloud Computing', icon: '☁️', modules: [
 M('Cloud Basics', 'B', 'What is cloud computing?,Evolution of cloud computing,Cloud characteristics[On-demand self-service/Resource pooling/Scalability/Elasticity/Measured service],Cloud architecture'),
 M('Service and Deployment Models', 'B', 'IaaS,PaaS,SaaS,Public cloud,Private cloud,Hybrid cloud,Community cloud'),
 M('Virtualization and Containers', 'I', 'Virtualization,Hypervisors,Virtual machines,Containers,Docker fundamentals'),
 M('Cloud Networking', 'I', 'Cloud networking,IP addresses,DNS,HTTP/HTTPS,Firewalls,Load balancing'),
 M('Storage and Databases', 'I', 'Storage[Object storage/Block storage/File storage],Cloud databases'),
 M('Cloud Security', 'I', 'IAM,Authentication,Authorization,Cloud security,Encryption,Shared responsibility model'),
 M('Reliability', 'A', 'Availability,Fault tolerance,Disaster recovery,Monitoring,Serverless'),
 M('AWS', 'I', 'AWS introduction,AWS global infrastructure[Regions/Availability zones],EC2,S3,IAM (AWS),Lambda,RDS'),
 M('Deployment', 'A', 'Cloud deployment,CI/CD,GitHub Actions basics,Deploying websites,Deploying backend applications,Cloud projects')
]},

{ id: 'html', name: 'HTML', icon: '🌐', modules: [
 M('Basics', 'B', 'What is HTML?,HTML history,HTML versions,HTML5,HTML document structure,DOCTYPE,html tag,head,body,Title,Headings,Paragraphs,Line breaks,Horizontal rules,Comments'),
 M('Text, Links and Images', 'B', 'Text formatting[Bold/Italic/Strong/Emphasis/Superscript/Subscript],Links[Absolute URLs/Relative URLs/Anchor links],Images[Image attributes]'),
 M('Lists and Tables', 'B', 'Lists[Ordered lists/Unordered lists/Description lists],Tables[Table rows/Table cells/Table headers/Table captions]'),
 M('Forms', 'I', 'Forms,Form attributes,Input types[Text inputs/Email inputs/Password inputs/Number inputs/Radio buttons/Checkboxes],Select,Textarea,Buttons,Labels,Form validation'),
 M('Semantic HTML and Media', 'I', 'Semantic HTML[Header/Nav/Main/Section/Article/Aside/Footer],Audio,Video,Iframes'),
 M('Advanced HTML', 'A', 'HTML entities,Data attributes,Meta tags,SEO basics,Accessibility,HTML projects')
]},

{ id: 'css', name: 'CSS', icon: '🎨', modules: [
 M('CSS Basics', 'B', 'What is CSS?,Inline CSS,Internal CSS,External CSS,CSS syntax'),
 M('Selectors', 'B', 'Selectors,Universal selector,Element selector,Class selector,ID selector,Attribute selectors,Descendant selector,Child selector,Grouping,Specificity,Cascade,Inheritance'),
 M('Colors, Units and Typography', 'B', 'Colors,Background colors,Background images,Opacity,Units[px/%/em/rem/vh/vw],Typography[Font family/Font size/Font weight/Line height/Text alignment/Text decoration]'),
 M('Box Model and Display', 'B', 'Box model[Content/Padding/Border/Margin],Border radius,Box shadow,Display[Block/Inline/Inline-block/None]'),
 M('Positioning', 'I', 'Position[Static/Relative/Absolute/Fixed/Sticky],Z-index,Overflow,Float'),
 M('Flexbox', 'I', 'Flexbox,Flex container,Flex items,Direction,Justify content,Align items,Align content,Flex wrap,Gap'),
 M('CSS Grid', 'I', 'CSS Grid,Grid columns,Grid rows,Grid gap,Grid areas'),
 M('Pseudo Classes and Elements', 'I', 'Pseudo-classes[Hover/Focus/Active/nth-child],Pseudo-elements[Before/After]'),
 M('Motion', 'I', 'Transitions,Transform[Translate/Rotate/Scale],Animations,Keyframes'),
 M('Responsive and Modern CSS', 'A', 'Responsive design,Media queries,Breakpoints,Mobile-first design,CSS variables,Custom properties,Dark mode,Basic accessibility,CSS projects')
]},

{ id: 'js', name: 'JavaScript', icon: '⚡', modules: [
 M('Getting Started', 'B', 'What is JavaScript?,JavaScript history,JavaScript in browsers,Linking JavaScript[Inline JavaScript/Internal JavaScript/External JavaScript],Console'),
 M('Variables, Types and Operators', 'B', 'Variables[var/let/const],Data types[Primitive types/Reference types],Type conversion,Type coercion,Operators[Arithmetic/Comparison/Logical/Assignment/Ternary]'),
 M('Strings, Arrays and Objects', 'B', 'Strings,String methods,Template literals,Arrays,Array indexing,Array methods[push/pop/shift/unshift/splice/slice/concat/includes/indexOf],Objects,Properties,Methods,Nested objects,Object destructuring'),
 M('Control Flow', 'B', 'Conditional statements[if/else/else if/switch],Loops[for/while/do while/for of/for in],break,continue'),
 M('Functions', 'I', 'Functions,Function declaration,Function expression,Arrow functions,Parameters,Arguments,Return,Scope[Global scope/Local scope/Block scope],Hoisting,Closures,Recursion,Callback functions,Higher-order functions[map/filter/reduce/find/some/every/sort]'),
 M('DOM', 'I', 'DOM,DOM tree,Selecting elements[getElementById/querySelector/querySelectorAll],Changing content,Changing styles,Creating elements,Removing elements'),
 M('Events', 'I', 'Events,Event listeners,Click events,Keyboard events,Input events,Form events,Event bubbling,Event delegation,Form validation'),
 M('Browser Storage and Errors', 'I', 'JSON,Local storage,Session storage,Cookies basics,Error handling[try/catch/finally/throw]'),
 M('Asynchronous JavaScript', 'A', 'Promises[Promise states/then/catch/finally],Async/await,Fetch API,HTTP requests[GET/POST],API integration'),
 M('Modern JavaScript', 'A', 'ES6 modules[Import/Export],Spread operator,Rest operator,Destructuring,Optional chaining,Nullish coalescing,Set,Map,Date,Math'),
 M('Practice', 'A', 'Debugging,JavaScript projects,JavaScript interview questions')
]},

{ id: 'bs', name: 'Bootstrap', icon: '🅱️', modules: [
 M('Getting Started', 'B', 'Introduction,Advantages,Installation,CDN,Bootstrap files'),
 M('Layout', 'B', 'Containers[Container/Container-fluid],Grid system[Rows/Columns/12-column grid/Breakpoints/Responsive classes/Gutters]'),
 M('Content', 'B', 'Typography,Text utilities,Colors,Background utilities,Tables,Responsive tables,Images,Figures'),
 M('Components', 'I', 'Buttons,Button groups,Alerts,Badges,Cards,Navbar,Navigation,Dropdowns,Pagination,Breadcrumbs,Progress bars,Spinners'),
 M('Forms', 'I', 'Forms,Form controls,Input groups,Validation'),
 M('Interactive Components', 'I', 'Modal,Accordion,Collapse,Carousel,Toasts,Tooltips,Popovers'),
 M('Utilities and Customization', 'A', 'Utility classes,Spacing,Display,Flex utilities,Shadows,Borders,Bootstrap icons,Customizing Bootstrap,Bootstrap projects')
]},

{ id: 'react', name: 'React.js', icon: '⚛️', modules: [
 M('React Foundations', 'B', 'What is React?,Why React?,SPA concepts,Virtual DOM,React architecture'),
 M('Setup', 'B', 'Installing Node.js,npm,Vite,Creating a React application,Project structure'),
 M('JSX and Components', 'B', 'JSX,JSX rules,Components,Functional components,Component composition,Reusable components'),
 M('Props and State', 'I', 'Props,Passing props,Props destructuring,State,useState,Updating state,Event handling,Conditional rendering,Rendering lists,Keys'),
 M('Styling and Forms', 'I', 'Styling React[CSS/CSS modules basics],Forms,Controlled components,Uncontrolled components,Form handling'),
 M('Effects and APIs', 'I', 'useEffect,Effects,Dependencies,Cleanup,API requests,Fetch,Loading states,Error states'),
 M('Hooks and Context', 'I', 'useRef,useContext,Context API,Prop drilling,Custom hooks'),
 M('React Router', 'I', 'React Router,Routes,Route parameters,Navigation,Nested routes,SPA routing'),
 M('Architecture and Performance', 'A', 'State management fundamentals,Lifting state,React project organization,Environment variables,React performance basics,Memoization basics[React.memo/useMemo/useCallback],Error boundaries,React developer tools'),
 M('Shipping and Practice', 'A', 'Build and deployment,React interview questions,React projects')
]},

{ id: 'apt', name: 'Aptitude', icon: '🧮', modules: [
 M('Number System and Arithmetic', 'B', 'Number systems[Natural numbers/Whole numbers/Integers/Rational numbers],Divisibility,Prime numbers,Factors,Multiples,HCF,LCM,Simplification,BODMAS,Fractions,Decimals'),
 M('Percentages, Ratios and Averages', 'B', 'Percentages[Percentage increase/Percentage decrease],Ratio,Proportion,Averages,Problems on ages'),
 M('Profit and Interest', 'I', 'Profit,Loss,Discount,Simple interest,Compound interest,Partnership,Mixtures,Allegations'),
 M('Time, Work and Distance', 'I', 'Time and work,Work efficiency,Pipes and cisterns,Time and distance,Speed,Relative speed,Trains,Boats and streams'),
 M('Counting and Data Interpretation', 'I', 'Permutations,Combinations,Probability,Sequences,Number series,Data interpretation[Tables/Bar charts/Pie charts/Line graphs]'),
 M('Logical Reasoning', 'I', 'Analogy,Classification,Odd one out,Coding-decoding,Letter series,Number series (reasoning),Directions,Blood relations,Ranking,Order,Seating arrangements[Linear seating/Circular seating],Puzzles,Syllogisms,Venn diagrams,Statement and conclusion,Statement and assumption,Statement and argument,Cause and effect,Decision making,Clocks,Calendars'),
 M('Verbal Ability', 'I', 'Parts of speech[Nouns/Pronouns/Verbs/Adjectives/Adverbs/Prepositions/Conjunctions/Articles],Tenses,Subject-verb agreement,Sentence correction,Error spotting,Synonyms,Antonyms,Vocabulary,Idioms,One-word substitutions,Sentence completion,Para jumbles,Reading comprehension')
]}
];

/* ---------- Parser: turns the strings above into item objects ----------
   Result: module.items = [{id, name, level, kids:[{id,name,level,p}]}] */
SUBJECTS.forEach(s => s.modules.forEach((m, mi) => {
  m.items = m.list.split(',').map((raw, ti) => {
    const mt = raw.trim().match(/^(.*?)\[(.*)\]$/);
    const id = `${s.id}-${mi}-${ti}`;
    return {
      id, name: mt ? mt[1] : raw.trim(), level: m.level,
      kids: mt ? mt[2].split('/').map((k, ci) => ({ id: id + '-' + ci, name: k.trim(), level: m.level, p: id })) : []
    };
  });
}));
