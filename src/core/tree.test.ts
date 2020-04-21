import { Tree, makeTree, TreeIdProvider } from "./tree"

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
    const sequentialIdProviderFn = [0, 1, 2, 0, 22, 33, 44]
        .reduce((acc, cur) => acc.mockReturnValueOnce(cur), jest.fn());
    const mockIdProvider = {
        generate: sequentialIdProviderFn,
    };
    const _makeTree = _ => makeTree(_, { idProvider: mockIdProvider });

    const otherTree = _makeTree("other", { idProvider: mockIdProvider })
        .addToRoot("adjin")
        .addToRoot("dwa");
    expect(sequentialIdProviderFn.mock.calls.length).toBe(3);

    const tree = _makeTree("").addTreeToRoot(otherTree, mockIdProvider);

    expect(sequentialIdProviderFn.mock.calls.length).toBe(7);
    expect(tree.flatten().sort().map(node => node.id)).toStrictEqual([0, 22, 33, 44]);
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

test("root ID can be recognized", () =>
{
    const idProvider = new TreeIdProvider();

    expect(idProvider.isRootId(idProvider.generate())).toBe(true); // first ID is the root ID
    expect(idProvider.isRootId(idProvider.generate())).toBe(false); // the following are not
});

test("the ID rolls over", () =>
{
    const idProvider = new TreeIdProvider(new TreeIdProvider().UPPER_ID_BOUND);

    expect(() => 
    {
        idProvider.generate();
    }).toThrow();

    expect(idProvider.generate()).toBe(idProvider.LOWER_ID_BOUND);
});

test("tree IDs are rebuilt upon overflow", () =>
{
    // don't want to instantiate 18 quadrilion objects for every test run
    class MockTreeIdProvider extends TreeIdProvider
    {
        constructor()
        {
            super();

            this.LOWER_ID_BOUND = 0;
            this.UPPER_ID_BOUND = 5;
            this.ROOT_ID = this.LOWER_ID_BOUND;

            this.next_id = this.ROOT_ID;
        }
    }
    const tree = makeTree("", { idProvider: new MockTreeIdProvider() });

    tree
        .add(0, "")
        .add(0, "")
        .add(0, "")
        .add(0, "") // 4 nodes
        .removeNode(1)
        .removeNode(2) // 2 nodes left
        .add(0, "latest")
    ;

    const latestNode = tree.flatten().find(node => node.data === "latest");

    expect(latestNode.id).toBe(3);
});
