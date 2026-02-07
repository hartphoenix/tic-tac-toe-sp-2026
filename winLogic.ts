
// index = x + y*3 + z*9

// Layer z=0 (front):    Layer z=1 (middle):   Layer z=2 (back):
//  0 | 1 | 2             9 | 10| 11            18| 19| 20
// -----------           -----------           -----------
//  3 | 4 | 5            12 | 13| 14            21| 22| 23
// -----------           -----------           -----------
//  6 | 7 | 8            15 | 16| 17            24| 25| 26

const layer1 = [ // front layer
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontals
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // verticals
    [0, 4, 8], [2, 4, 6] //          diagonals
]
const layer2 = layer1.map(line => line.map(n => n + 9)) // middle layer
const layer3 = layer1.map(line => line.map(n => n + 18)) // back layer

const tunnels = [] //tunnel through the z axis front to back
const tunnel0 = [0, 9, 18]
for (let i = 0; i < 9; i++) {
    tunnels.push(tunnel0.map(n => n + i))
}

const diagTunnels: number[][] = [] //tunnel diagonally through the z axis
const diagTunnel0 = [0, 10, 20] // diagonal through horizontal plane
const diagTunnel1 = [2, 10, 18]
const diagTunnel2 = [0, 12, 24] // diagonal through vertical plane
const diagTunnel3 = [6, 12, 18]

for (let i = 0; i < 3; i++) {
    diagTunnels.push(diagTunnel0.map(n => n + (i * 3)))
    diagTunnels.push(diagTunnel1.map(n => n + (i * 3)))
    diagTunnels.push(diagTunnel2.map(n => n + i))
    diagTunnels.push(diagTunnel3.map(n => n + i))
}
const doubleDiags = [[0, 13, 26], [2, 13, 24], [6, 13, 20], [8, 13, 18]]
export const winLines = layer1.concat(layer2, layer3, tunnels, diagTunnels, doubleDiags)
console.log(winLines.length)