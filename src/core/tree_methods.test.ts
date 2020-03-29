import * as tree from "./tree_methods"

interface testData{
    name: string,
};
const makeTree = (x: testData) => tree.makeTree<testData>(x);

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
    node.addTree(makeTree({name: "notatka2od3"}));
    expect(node.children.some(child => (child.data.name === "notatka2od3"))).toEqual(true);
});

test("find node with string", () => 
{
    let root = treeRoot.clone();
    let nodesWithString = root.children.filter((child) => child.data.name.includes("1od"));
    expect(nodesWithString.every(obj => obj.data.name.includes("1od"))).toEqual(true);
});

test("filter function", () =>
{
    let root = treeRoot.clone();
    let filteredNodes = root.filter((child) => child.data.name.includes("1od"))
}
)

test("find parent of a node", () => 
{
    let root = treeRoot.clone();
    let exampleNode = root.filter((child) => child.data.name.includes("1od"))[0];
    let exampleParent = exampleNode.getParent({ node: exampleNode, root });
    expect(exampleParent.data).toEqual("notka2");
});

test("remove node", () => 
{
    let root = treeRoot.clone();
    let x = root.filter((child) => child.data.name.includes("notka4"))[0];
    let xChildren = x.children;
    let parent = root.getParent({ node: x, root })
    root.getParent({ node: x, root }).removeNode(x);
    expect(root.length).toEqual(7);
    expect(parent.children.some(child => child.data.name === "notka2od2")).toEqual(false);
    expect(parent.children).toEqual(expect.arrayContaining(xChildren));
});
