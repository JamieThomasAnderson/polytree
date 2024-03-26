import ForceGraph2D from "react-force-graph-2d";


export const Graph = () => {

    function genRandomTree(N = 300, reverse = false) {
        return {
            nodes: Array.from(Array(N).keys()).map(i => ({ id: i })),
            links: Array.from(Array(N).keys())
                .filter(id => id)
                .map(id => ({
                    [reverse ? 'target' : 'source']: id,
                    [reverse ? 'source' : 'target']: Math.round(Math.random() * (id-1))
                }))
        };
    }
    return(
        <div className="border-2 border-sky-500" >
            <ForceGraph2D
                graphData={genRandomTree(40)}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                linkCurvature={0.25}
            />
        </div>
    )
}