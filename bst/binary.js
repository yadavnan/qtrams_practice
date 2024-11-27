const createNode = (data = null, left = null, right = null) => ({
    data,
    left,
    right,
  });
  
  const buildTree = (array) => {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
  
    const build = (arr) => {
      if (arr.length === 0) return null;
      const mid = Math.floor(arr.length / 2);
      return createNode(
        arr[mid],
        build(arr.slice(0, mid)), 
        build(arr.slice(mid + 1)) 
      );
    };
  
    return build(sortedArray); 
  };
  
  const insert = (node, value) => {
    if (node === null) return createNode(value);
    if (value < node.data) {
      node.left = insert(node.left, value);
    } else if (value > node.data) {
      node.right = insert(node.right, value);
    }
    return node;
  };
  
  const deleteItem = (node, value) => {
    if (node === null) return null;
  
    if (value < node.data) {
      node.left = deleteItem(node.left, value);
    } else if (value > node.data) {
      node.right = deleteItem(node.right, value);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;
  
      const minLargerNode = findMin(node.right);
      node.data = minLargerNode.data;
      node.right = deleteItem(node.right, minLargerNode.data);
    }
  
    return node;
  };
  
  const findMin = (node) => {
    while (node.left !== null) node = node.left;
    return node;
  };
  
  const levelOrder = (root, callback) => {
    if (!callback) throw new Error("Callback function is required.");
    const queue = [root];
    while (queue.length > 0) {
      const current = queue.shift();
      callback(current);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  };
  
  const inOrder = (node, callback) => {
    if (!callback) throw new Error("Callback function is required.");
    if (node !== null) {
      inOrder(node.left, callback);
      callback(node);
      inOrder(node.right, callback);
    }
  };
  
  const preOrder = (node, callback) => {
    if (!callback) throw new Error("Callback function is required.");
    if (node !== null) {
      callback(node);
      preOrder(node.left, callback);
      preOrder(node.right, callback);
    }
  };
  
  const postOrder = (node, callback) => {
    if (!callback) throw new Error("Callback function is required.");
    if (node !== null) {
      postOrder(node.left, callback);
      postOrder(node.right, callback);
      callback(node);
    }
  };
  
  const height = (node) => {
    if (node === null) return -1;
    return 1 + Math.max(height(node.left), height(node.right));
  };
  
  const depth = (root, node, currentDepth = 0) => {
    if (root === null) return -1;
    if (root === node) return currentDepth;
  
    if (node.data < root.data) return depth(root.left, node, currentDepth + 1);
    return depth(root.right, node, currentDepth + 1);
  };
  
  const isBalanced = (node) => {
    if (node === null) return true;
  
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);
  
    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      isBalanced(node.left) &&
      isBalanced(node.right)
    );
  };
  
  const rebalance = (node) => {
    const nodes = [];
    inOrder(node, (n) => nodes.push(n.data)); 
    return buildTree(nodes); 
  };
  
  // Pretty Print Function (for visualization)
  const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) return;
    if (node.right) prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left) prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  };
  
  // Driver Code for Testing
  //const randomArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100)); // Random array of 15 numbers
  const randomArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]; // Provided input array

//const tree = buildTree(inputArray);
  const tree = buildTree(randomArray);
  
  console.log("Is Balanced?", isBalanced(tree));
  
  console.log("Level Order:");
  levelOrder(tree, (node) => console.log(node.data));
  
  console.log("Inorder:");
  inOrder(tree, (node) => console.log(node.data));
  
  console.log("Preorder:");
  preOrder(tree, (node) => console.log(node.data));
  
  console.log("Postorder:");
  postOrder(tree, (node) => console.log(node.data));
  
  insert(tree, 150);//we are unbalancingitbyaddingmorethan100
  insert(tree, 200);
  insert(tree, 250);
  
  console.log("Is Balanced after insertions?", isBalanced(tree));
  
  // Rebalancing again
  const balancedTree = rebalance(tree);
  
  console.log("Is Balanced after rebalancing?", isBalanced(balancedTree));
  
  // Visualize the Tree (Pretty Print)
  console.log("Visualize Tree:");
  prettyPrint(balancedTree);
  