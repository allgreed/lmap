local nix_shell_step(kind) = 
    {
        "name": kind,
        "image": "nixos/nix:2.3",
        "commands:": 
        [
            "nix-shell --run 'make %s'" % kind,
        ]
    };

{
    "kind": "pipeline",
    "type": "docker",
    "name": "default",
    "steps": std.map(nix_shell_step, 
    [
        "lint",
        "test",
        "build",
        //"docker",
    ])
}

