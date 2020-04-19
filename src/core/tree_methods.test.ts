import { makeTree } from "./tree_methods"

interface testData{
    name: string,
};

let treeRoot = makeTree({name: "korzen"})
    .add({name: "notka1"})
    .add({name: "notka2"})
    .addTree(makeTree({name: "notka3"})
        .add({name: "notka1od3"})
        .add({name: "notka2od3"}))
    .addTree(makeTree({name: "notka4"})
        .add({name: "notka1od4"})
        .add({name: "notka2od4"})
        .addTree(makeTree({name: "notka3od4"})
            .add({name: "notka1od34"})
            .add({name: "notka2od34"}))
        .add({name: "notka5"}));


test("count tree nodes", () => 
{
    let root = treeRoot.clone();
    expect(root.length).toEqual(12);
});

test("add node", () => 
{
    let root = treeRoot.clone();
    let node = root.children.filter(child => (child.data.name === "notka3"))[0]
    node.add({name: "notatka2od3"});
    expect(node.children.some(child => (child.data.name === "notatka2od3"))).toEqual(true);
});

test("add tree", () =>
{
    // TODO: put the id provider on a class and inject it in one place, not 4
    const sequentialIdProvider = [1, 2, 3, 4, 22, 33, 44]
        .reduce((acc, cur) => acc.mockReturnValueOnce(cur), jest.fn())

    const root = makeTree("", sequentialIdProvider); 
    const initialRootId = root.id;
    const otherTree = makeTree("other", sequentialIdProvider)
        .add("adjin", sequentialIdProvider)
        .add("dwa", sequentialIdProvider);
    expect(sequentialIdProvider.mock.calls.length).toBe(4);

    root.addTree(otherTree, sequentialIdProvider); 

    expect(sequentialIdProvider.mock.calls.length).toBe(7);
    expect(root.id).toBe(initialRootId);
    expect(root.children[0].id).toBe(22);
    expect(root.children[0].children.map(node => node.id)).toStrictEqual([33, 44]);
});

test("flatten a tree", () =>
{
    let root = treeRoot.clone();
    let flattenedTree = root.flatten();
    expect(flattenedTree.length).toEqual(13)
})

test("find node with string", () => 
{
    let root = treeRoot.clone();
    let nodesWithString = root.flatten().filter((child) => child.data.name.includes("1od"));
    expect(nodesWithString.every(obj => obj.data.name.includes("1od"))).toEqual(true);
});

test("find parent of a node", () => 
{
    let root = treeRoot.clone();
    let exampleNode = root.flatten().filter((child) => child.data.name.includes("notka1od3"))[0];
    let exampleParent = exampleNode.getParent(exampleNode, root);
    expect(exampleParent.data.name).toEqual("notka3");
});

test("remove node", () => 
{
    let root = treeRoot.clone();
    let x = root.flatten().filter((child) => child.data.name.includes("notka3od4"))[0];
    let xChildren = x.children;
    let parent = root.getParent(x, root) // notka4
    let lenBeforeRemoval = root.length

    root.getParent(x, root).removeNode(x);

    expect(root.length).toEqual(lenBeforeRemoval - 1);
    expect(parent.children.some(child => child.data.name === "notka3od4")).toEqual(false);
    // TODO: check rest of the tree, check order of items in tree
    //expect(parent.children).toEqual(expect.arrayContaining(xChildren));
});
