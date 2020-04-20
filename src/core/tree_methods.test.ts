import { Tree, makeTree } from "./tree_methods"

interface testData{
    name: string,
};

let treeRoot = makeTree({name: "korzen"})
    .addToRoot({name: "notka1"})
    .addToRoot({name: "notka2"})
    .addTreeToRoot(makeTree({name: "notka3"})
        .addToRoot({name: "notka1od3"})
        .addToRoot({name: "notka2od3"}))
    .addTreeToRoot(makeTree({name: "notka4"})
        .addToRoot({name: "notka1od4"})
        .addToRoot({name: "notka2od4"})
        .addTreeToRoot(makeTree({name: "notka3od4"})
            .addToRoot({name: "notka1od34"})
            .addToRoot({name: "notka2od34"}))
        .addToRoot({name: "notka5"}));


test("count tree nodes", () => 
{
    const root = treeRoot.clone();
    expect(root.length).toEqual(12);
});

test("add node", () => 
{
    const tree = treeRoot.clone();
    // TODO: less fucked up way of selecting a specific node inside a tree?
    const node = tree.root.children.filter(child => (child.data.name === "notka3"))[0]

    tree.add(node.id, {name: "notatka2od3"});

    // TODO: make literal comparison
    expect(node.children.some(child => (child.data.name === "notatka2od3"))).toEqual(true);
});

test("add tree", () =>
{
    const sequentialIdProvider = [3, 4, 22, 33, 44]
        .reduce((acc, cur) => acc.mockReturnValueOnce(cur), jest.fn())
    const _makeTree = _ => makeTree(_, { idProvider: sequentialIdProvider });

    const otherTree = _makeTree("other")
        .addToRoot("adjin")
        .addToRoot("dwa");
    expect(sequentialIdProvider.mock.calls.length).toBe(2);

    const tree = _makeTree("").addTreeToRoot(otherTree, sequentialIdProvider);

    expect(sequentialIdProvider.mock.calls.length).toBe(5);
    expect(tree.flatten().sort().map(node => node.id)).toStrictEqual([-9007199254740991, 22, 33, 44]);
});

test("flatten a tree", () =>
{
    const tree = treeRoot.clone();

    const flattenedTree = tree.flatten();

    // TODO: make literal comparison - use Set
    expect(flattenedTree.length).toEqual(13)
})

test("find node with string", () => 
{
    const tree = treeRoot.clone();

    const nodesWithString = tree.flatten().filter(node => node.data.name.includes("1od"));

    // TODO: make literal comparison
    expect(nodesWithString.every(node => node.data.name.includes("1od"))).toEqual(true);
});

// TODO: should this be tested or is implementation detail?
test("find parent of a node", () => 
{
    const tree = treeRoot.clone();
    const node = tree.flatten().filter(node => node.data.name.includes("notka1od3"))[0];

    // TODO: uncrap the getParent API
    expect(node.getParent(node, tree.root).data.name).toEqual("notka3");
});

test("remove node", () => 
{
    const tree = treeRoot.clone();
    const x = tree.flatten().filter((child) => child.data.name.includes("notka3od4"))[0];
    const xChildren = x.children;
    const parent = x.getParent(x, tree.root) // notka4
    const lenBeforeRemoval = tree.length

    const treeWithoutANode = tree.removeNode(x.id);

    expect(treeWithoutANode.length).toEqual(lenBeforeRemoval - 1);
    expect(parent.children.some(child => child.data.name === "notka3od4")).toEqual(false);
    // TODO: check rest of the tree, check order of items in tree
    //expect(parent.children).toEqual(expect.arrayContaining(xChildren));
});
