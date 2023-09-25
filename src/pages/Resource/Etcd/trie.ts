class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node: TrieNode = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  contains(word: string): boolean {
    let node: TrieNode | undefined = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node?.children.has(char)) {
        return false;
      }
      node = node.children.get(char);
    }
    return node?.isEndOfWord ?? false;
  }

  find(prefix: string): string[] {
    const words: string[] = [];
    let node = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (!node.children.has(char)) {
        return words;
      }
      node = node.children.get(char)!;
    }
    const queue: TrieNode[] = [node];
    const prefixes: string[] = [prefix];
    while (queue.length > 0) {
      const currNode = queue.shift()!;
      const currPrefix = prefixes.shift()!;
      if (currNode.isEndOfWord) {
        words.push(currPrefix);
      }
      for (const [char, childNode] of currNode.children) {
        queue.push(childNode);
        prefixes.push(currPrefix + char);
      }
    }
    return words;
  }

  delete(word: string): void {
    this._delete(this.root, word, 0);
  }

  private _delete(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      if (!node.isEndOfWord) {
        return false;
      }
      node.isEndOfWord = false;
      return node.children.size === 0;
    }

    const char = word[index];
    if (!node.children.has(char)) {
      return false;
    }

    const childNode = node.children.get(char)!;
    const shouldDeleteChild = this._delete(childNode, word, index + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);
      return node.children.size === 0;
    }

    return false;
  }
}

const trie = new Trie();

const rawData = [
  '/microservices//LAPTOP-E2D13LJD',
  '/microservices/newbee-clean-highload-backup/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-data-bus/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-device-plan/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-dispatch-tools/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-expand-exec/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-group-optimize/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-group-plan/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-res-expand-v2/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-res-plan/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-review/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-rp-conf/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/newbee-svc-metric/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/rocket_analysis/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/rocket_control/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/rocket_strategy/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/rp-api-v2/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/rp-web/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/rp_api/bsy-fujian-xiamen-1-172-18-156-138',
  '/microservices/rp_heap/bsy-fujian-xiamen-1-172-18-156-138',
];

const newData = rawData
  .map((key) => {
    const prefixs = key.substring(1).split('/');
    return prefixs.map((_, index) =>
      '/'.concat(prefixs.slice(0, index + 1).join('/')),
    );
  })
  .flat();
console.log(newData);

for (const item of newData) {
  if (item === '') {
    console.error('item is empty');
    continue;
  }
  trie.insert(item);
}

console.log(trie.find('/microservices/rp-web'));
