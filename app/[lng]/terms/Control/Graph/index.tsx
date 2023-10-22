//terms/graph

'use client'
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Graph = () => {
    interface Point {
        id: string;
        title: string;
        x: number;
        y: number;
    }

    interface Link {
        upstream_id: string;
        downstream_id: string;
        weight: number;
        source: Point;  // 这些是为了兼容D3的模拟期望的属性
        target: Point;
    }

    const svgRef = useRef(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);

    useEffect(() => {
        fetch('terms/points').then(response => response.json()).then(data => {
            setPoints(data);
            // 一旦points数据被填充，再获取links数据
            fetch('terms/links').then(response => response.json()).then(linkData => {
                // 确保每个链接都有有效的源和目标
                const validLinks = linkData.filter(link => {
                    return data.some(p => p.id === link.upstream_id) && 
                           data.some(p => p.id === link.downstream_id);
                });
                
                const transformedLinks = validLinks.map(link => ({
                    ...link,
                    source: data.find(p => p.id === link.upstream_id),
                    target: data.find(p => p.id === link.downstream_id)
                }));
                
                setLinks(transformedLinks);
            });
        });
    }, []);
    

    useEffect(() => {
        if (!points.length || !links.length) return;

        const width = 800;
        const height = 600;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const simulation = d3.forceSimulation(points)
            .force("link", d3.forceLink(links)
                .id(d => d.id)
                .distance(link => {
                    // 获取源节点和目标节点的半径大小
                    const sourceRadius = link.source.title.length * 0.4 * remInPixels;
                    const targetRadius = link.target.title.length * 0.4 * remInPixels;
                    // 根据半径大小动态地设置链接线的距离
                    return sourceRadius + targetRadius + 10;  // 20是两个圆之间的额外距离，可以根据需要调整
                })
            )
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));
        

        const link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "gray");

        const node = svg.selectAll(".node")
            .data(points)
            .enter().append("g");  // 使用'g'元素来组合圆圈和文字
        
        node.append("circle")
            .attr("class", "node")
            .attr("r", d => d.title.length * 0.4 * remInPixels)  // 根据标题长度调整半径大小
            .attr("fill", "rgb(255 251 235)");
        
            node.append("text")
            .attr("text-anchor", "middle")  // 水平居中对齐
            .attr("dy", "0.35em")  // 垂直居中对齐，此值可稍微调整以实现完美居中
            .text(d => d.title)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black");
        
        

        simulation.nodes(points).on("tick", function () {
            link.attr("x1", d => d.source.x || 0)
                .attr("y1", d => d.source.y || 0)
                .attr("x2", d => d.target.x || 0)
                .attr("y2", d => d.target.y || 0);

                node.attr("transform", d => `translate(${d.x}, ${d.y})`);

        });

    }, [points, links]);

    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default Graph;
