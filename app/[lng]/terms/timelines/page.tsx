'use client'
import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, XMarkIcon,MagnifyingGlassIcon,DocumentPlusIcon } from '@heroicons/react/24/solid';
import Select from 'react-select';


const Stars = () => {
    interface Point {
        id: number;
        title: string;
        description: string;
        main_line:string;
        order
        x: number;
        y: number;
    }

    interface Link {
        id: number;
        upstream_id: number;
        downstream_id: number;
        weight: number;
        source: Point;
        target: Point;
    }

    const svgRef = useRef<SVGSVGElement | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);

    const [points, setPoints] = useState<Point[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [remInPixels, setRemInPixels] = useState<number>(16); 

    const [selectedValue, setSelectedValue] = useState(null);  // 初始值为null

    const [upstream_id,setUpstreamId]= useState(0);
    const [downstream_id, setDownstreamId] = useState(0);
    const [weight, setWeight] = useState(0);

    const [selectedNode, setSelectedNode] = useState<Point | null>(null);
    const [initialNodeData, setInitialNodeData] = useState({
        title: "",
        description: "",
        main_line: ""
    });
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);
    const [initialLinkData, setInitialLinkData] = useState({
        upstream_id: 0,
        downstream_id: 0,
        weight: 0
    });
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [matchedNodes, setMatchedNodes] = useState<Point[]>([]);

    // 监听搜索项变化
    useEffect(() => {
        if (searchTerm) {
            const matched = points.filter(p => p.title.includes(searchTerm));
            setMatchedNodes(matched);
        } else {
            setMatchedNodes([]);
        }
    }, [searchTerm, points]);

    const fetchAndUpdateGraph = async () => {
        const data = await fetch('points').then(response => response.json());
        setPoints(data);
        const linkData = await fetch('links').then(response => response.json());
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
    };
    const setInitialRemInPixels = async () => {
        setRemInPixels(parseFloat(getComputedStyle(document.documentElement).fontSize));
    };
    useEffect(() => {
        fetchAndUpdateGraph();
        setInitialRemInPixels();
    }, []);

   

    useEffect(() => {
        if (!points.length) return;

        const width = window.innerWidth;
        const step = 20;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 20;
        const marginLeft = 130;
        const height = (points.length - 1) * step + marginTop + marginBottom;
      
     
    
        // Create scales and other functions
        const y = d3.scalePoint()
            // Sort points by the `order` property
            .domain(points.sort((a, b) => d3.ascending(a.order, b.order)).map(d => String(d.id)))
            .range([marginTop, height - marginBottom]);
      
        const color = d3.scaleOrdinal()
                        .domain(points.map(d => d.main_line).sort(d3.ascending))
                        .range(d3.schemeCategory10)
                        .unknown("#aaa");
      
        const groups = new Map(points.map(d => [d.id, d.main_line]));
        const improvedColorScheme = {
            "数域拓展": "#FF0000", // 红色
            "数量关系": "#FF7F00", // 橙色
            "谜题游戏": "#FFD700", // 金黄色
            "空间观念": "#32CD32", // 鲜绿色
            "分析推理": "#0000FF", // 蓝色
            "应用意识": "#4B0082", // 靛色
            "运算技能": "#9400D3", // 紫色
            "代数关系": "#00CED1", // 青色
            "计算原理": "#87CEEB", // 天青色
            "特殊技巧": "#FFA07A"  // 淡橙色
        };
        
        

        const getColorForMainLine = (mainLine) => {
            return improvedColorScheme[mainLine] || "#aaa"; // "#aaa" 是默认颜色
        };

        let currentDraggedNode: Point | null = null;


        function samegroup({ source, target }) {
            const groupSource = groups.get(source.id);
            const groupTarget = groups.get(target.id);
            return groupSource === groupTarget ? groupSource : "default"; // 或者使用空字符串 ""
          }
          
    
        const Y = new Map(points.sort((a, b) => d3.ascending(a.order, b.order)).map(d => [d.id, y(String(d.id))]));
        function arc(d) {
          const y1 = Y.get(d.source.id);
          const y2 = Y.get(d.target.id);
          if (typeof y1 === 'undefined' || typeof y2 === 'undefined') {
            // Handle the undefined case here
            // For example, you could return an error or a default value
            throw new Error('One of the ids is not in the Map Y');
          }
          const r = Math.abs(y2 - y1) / 2;
          return `M${marginLeft},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${marginLeft},${y2}`;
        }
        
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        svg.selectAll("*").remove();

        const path = svg.append("g")
                .attr("fill", "none")
                .attr("stroke-opacity", 0.8)            
                .attr("stroke-width", 2)
                .selectAll("path")
                .data(links)
                .join("path")
                .attr("stroke", d => getColorForMainLine(d.source.main_line))
                .attr("d", arc)
                .on('click', function(event, d) {
                    setSelectedLink(d);
                    setUpstreamId(d.upstream_id);
                    setDownstreamId(d.downstream_id);
                    setWeight(d.weight);
                });

        const drag = d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);

        const dotXPosition = 130; // You can adjust this value as needed

        // Create node groups
        const node = svg.append("g")
            .selectAll("g")
            .data(points)
            .join("g")
            .attr("class", "node")
            .attr("id", d => `node-${d.id}`) // Assign a unique ID based on node's id
            .attr("transform", d => `translate(0,${Y.get(d.id)})`)
            .call(drag as any)
            .on('click', function(event, d) {
                setSelectedNode(d);
                setTitle(d.title);
                setDescription(d.description);
                setMainLine(d.main_line);
            });
        
        // Append labels to the node groups
        node.append("text")
            .attr("x", dotXPosition - 10) // Position labels to the left of the dots
            .attr("dy", "0.35em")
            .attr("text-anchor", "end") // Right-align text
            .attr("fill", d => getColorForMainLine(d.main_line)) // 使用 getColorForMainLine 设置颜色
            .attr("font-size", "12px") // Adjust the font size here
            .style("cursor", "pointer") // Set the cursor to pointer
            .text(d => d.title);

        // Append circles (dots) to the node groups
        node.append("circle")
            .attr("cx", dotXPosition)
            .attr("r", 3)
            .attr("fill", d => getColorForMainLine(d.main_line)); // 使用 getColorForMainLine 设置颜色



    // Constants
    const nodesPerGroup = 8;
    const groupHeight = nodesPerGroup * step; // Assuming 'step' is the vertical spacing between nodes

    points.forEach((point, index) => {
        if (index % nodesPerGroup === 0) {
            const yValue = Y.get(point.id);
            if (typeof yValue === 'undefined') {
                // 如果 Y 中没有对应的值，可以选择跳过
                return;
            }
            const rectY = yValue - step / 2; // 使用 yValue 代替 Y.get(point.id)
            const color = (Math.floor(index / nodesPerGroup) % 2 === 0) ? "white" : "#f0f0f0"; 
    
            svg.insert("rect", ":first-child")
                .attr("x", 0)
                .attr("y", rectY)
                .attr("width", width)
                .attr("height", groupHeight)
                .attr("fill", color);
        }
    });
    

       let offset = { x: 0, y: 0 };

       function dragstarted(this: Element, event: any, d: any) {
                currentDraggedNode = d;
                const cx = +d3.select(this).attr("cx");
                const cy = +d3.select(this).attr("cy");
                const point = d3.pointer(event, svgRef.current);
                offset.x = cx - point[0];
                offset.y = cy - point[1];
            }
            
            function dragged(this: Element,event: any, d:any) {
                    // Update the transform of the group being dragged

                    if (currentDraggedNode) {
                    d3.select(this)
                    .attr("transform", `translate(0,${event.y})`);

                // Update the position of the currently dragged node
                currentDraggedNode.x = event.x;
                currentDraggedNode.y = event.y;
                const point = d3.pointer(event, svgRef.current);
                d3.select(this)
                    .attr("cx", point[0] + offset.x)
                    .attr("cy", point[1] + offset.y);
            }
        }
            


        function dragended(this: Element, event: any, d: any) {
            currentDraggedNode = null;
        
            // Calculate the final position after the drag
            const point = d3.pointer(event, svgRef.current);
            const newY = point[1];
        
            // Get the original Y position of the node
            const originalY = Y.get(d.id);
            if (typeof originalY === 'undefined') {
                // Handle the case where originalY is undefined
                // For example, you could skip the rest of the logic or use a default value
                return;
            }
        
            // Define a threshold for movement
            const movementThreshold = 5; // Adjust this value as needed
        
            // Check if the movement exceeds the threshold
            if (Math.abs(newY - originalY) > movementThreshold) {
                // If movement is significant, calculate the new order and update it
                const newOrder = calculateNewOrder(newY);
                updateOrder(d.id, newOrder);
            }
            // If movement is within the threshold, do not change the order
        }
        


        function calculateNewOrder(yPosition) {
            // 首先根据order排序points
            const sortedPoints = [...points].sort((a, b) => d3.ascending(a.order, b.order));
        
            // 如果拖动到最上面
            const firstPointY = Y.get(sortedPoints[0].id);
            if (typeof firstPointY === 'undefined' || yPosition < firstPointY) {
                return 1; // 最上面的order从1开始
            }
        
            // 遍历排序后的points以确定新的order
            for (let i = 0; i < sortedPoints.length - 1; i++) {
                const currentPointY = Y.get(sortedPoints[i].id);
                const nextPointY = Y.get(sortedPoints[i + 1].id);
        
                if (typeof currentPointY === 'undefined' || typeof nextPointY === 'undefined') {
                    continue; // 跳过未定义的值
                }
        
                // 如果拖动到两个节点之间
                if (yPosition > currentPointY && yPosition < nextPointY) {
                    return sortedPoints[i].order + 1;
                }
            }
        
            // 如果拖动到最下面
            return sortedPoints[sortedPoints.length - 1].order + 1;
        }
        
            async function updateOrder(pointId, newOrder) {
                const response = await fetch(`/terms/points/reorder`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: pointId, newOrder }),
                });
                if (response.ok) {
                    fetchAndUpdateGraph();
                } 
            }

            // Function to check if a link is associated with a node
            const isLinkConnectedToNode = (node, link) => {
                return link.source.id === node.id || link.target.id === node.id;
            };
            

            function handleMouseOver(event, d) {
                // Dim all nodes and links initially
                d3.selectAll('.node').transition().style('opacity', 0.1);
                d3.selectAll('.link').transition().style('opacity', 0.1);
            
                // Highlight the hovered node
                d3.select(event.currentTarget).transition().style('opacity', 1);
            
                // Highlight all links connected to the hovered node and their connected nodes
                d3.selectAll('.link')
                    .filter(link => isLinkConnectedToNode(d, link))
                    .transition()
                    .style('opacity', 1)
                    .each(function(link:any) {
                        // For each connected link, highlight the source and target nodes
                        d3.select(`#node-${link.source.id}`).transition().style('opacity', 1);
                        d3.select(`#node-${link.target.id}`).transition().style('opacity', 1);
                    });
            }
            
                        
            // Function to handle mouseout event
            function handleMouseOut() {
                // Reset the opacity of all nodes and links
                d3.selectAll('.link')
                    .transition()
                    .style('opacity', 1);
                d3.selectAll('.node')
                    .transition()
                    .style('opacity', 1);
            }

            d3.selectAll('.node')
                .on('mouseover', handleMouseOver)
                .on('mouseout', handleMouseOut);

            // Also apply a class to the links for easier selection
            path.attr('class', 'link');


        // 清理函数，移除拖动事件监听器
        return () => {
            svg.selectAll("circle").on(".drag", null);
        };
    }, [points, links, fetchAndUpdateGraph]); 

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState(false); // 新增state
    const [main_line, setMainLine] = useState('');
    const [upstreamPoints, setUpstreamPoints] = useState([{ id: 0, weight: 1 }]);
    const options = points.map(p => ({ value: p.id, label: p.title }));

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            setTitleError(true); // 显示错误
            return; // 不提交表单
        } else {
            setTitleError(false); // 清除错误
        }
        const response = await fetch(`/terms/points/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, main_line }),
        });
        const data = await response.json();
        if (data.id) {
            for (let point of upstreamPoints) {
                if (point.id) {
                    await fetch('/terms/links/add', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            upstream_id: point.id, 
                            downstream_id: data.id,
                            weight: point.weight
                        }),
                    });
                }
            }
            setTitle('');
            setDescription('');
            setMainLine('');
            setUpstreamPoints([{ id: 0, weight: 1 }]);
            
            await fetchAndUpdateGraph();
        }
    }

    const handleUpstreamPointChange = (index, key, value) => {
        const updatedPoints = [...upstreamPoints];
        updatedPoints[index][key] = value;
        setUpstreamPoints(updatedPoints);
    };
    const handleAddUpstreamPoint = () => {
        setUpstreamPoints([...upstreamPoints, { id: 0, weight: 1 }]);
    };
    const handleRemoveUpstreamPoint = () => {
        if (upstreamPoints.length > 1) {
            const newPoints = [...upstreamPoints];
            newPoints.pop();
            setUpstreamPoints(newPoints);
        }
    };

    useEffect(() => {
        if (selectedLink) {
            setInitialLinkData({
                upstream_id: selectedLink.upstream_id,
                downstream_id: selectedLink.downstream_id,
                weight: selectedLink.weight
            });
        }
    }, [selectedLink]);
    
    const handleEditLink = async () => {
        if (selectedLink) {
            console.log('启动传输')
            if (upstream_id === initialLinkData.upstream_id &&
                downstream_id === initialLinkData.downstream_id &&
                weight === initialLinkData.weight) {
                alert('请修改内容');
                return;  // 如果内容没有更改，就直接返回
            }        
            const response = await fetch(`/terms/links/${selectedLink.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    upstream_id: upstream_id,
                    downstream_id: downstream_id,
                    weight: weight
                }),
            });        
            const updatedLink = await response.json();
            console.log("After edit link request: ", updatedLink);
            await fetchAndUpdateGraph();
        };
    };
    
    const handleAddLink = async () => {
        if (selectedLink) {
            console.log('启动传输')
            if (upstream_id === initialLinkData.upstream_id &&
                downstream_id === initialLinkData.downstream_id &&
                weight === initialLinkData.weight) {
                alert('请修改内容');
                return;  // 如果内容没有更改，就直接返回
            }
        
            const response = await fetch(`/terms/links/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    upstream_id: upstream_id,
                    downstream_id: downstream_id,
                    weight: weight
                }),
            });
        
            await fetchAndUpdateGraph();
        };
    };

    const handleDeleteLink = async () => {
        if (selectedLink) {
        const response = await fetch(`/terms/links/${selectedLink.id}`, {
        method: 'DELETE',
        });
        if (response.ok) {
            await fetchAndUpdateGraph();
        }
        }
    };

    useEffect(() => {
        if (selectedNode) {
            setInitialNodeData({
                title: selectedNode.title,
                description: selectedNode.description,
                main_line: selectedNode.main_line
            });
        }
    }, [selectedNode]);

    const handleEdit = async () => {
        if (selectedNode) {
        if (initialNodeData && title === initialNodeData.title &&
            description === initialNodeData.description &&
            main_line === initialNodeData.main_line) {
            alert('请修改内容');
            return;  // 如果内容没有更改，就直接返回
        }

        const response = await fetch(`/terms/points/${selectedNode.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                main_line: main_line
            }),
        });

        const updatedNode = await response.json();
        console.log("After edit request: ", updatedNode);
        await fetchAndUpdateGraph();
        }
    };
    
    const handleDelete = async () => {
        if (selectedNode) {
        const response = await fetch(`/terms/points/${selectedNode.id}`, {
        method: 'DELETE',
        });
        if (response.ok) {
            await fetchAndUpdateGraph();
        }
        }   
    };
    const handleSearchIconClick = () => {
        setShowSearch(prevState => !prevState);
    };

    return(
        <div className='absolute flex justify-center items-center w-full h-full'>
        {selectedNode && (
            <div className="fixed top-14 w-1/2 z-50 bottom-10 bg-white shadow dark:bg-slate-600 p-4 rounded-lg overflow-y-auto">
                {/* Close button */}
                <button 
                    className="absolute top-3 right-3 bg-gray-200 dark:bg-slate-400 p-2 rounded-full focus:outline-none"
                    onClick={() => {setSelectedNode(null);setTitle('');setDescription('');setMainLine('');}}
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                
                {/* Point details */}
                <div className="flex flex-col space-y-4">
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-transparent border-b-2 focus:border-amber-500 p-2 text-xl"
                        placeholder="Title"
                    />
                    <textarea 
                        value={main_line}
                        onChange={(e) => setMainLine(e.target.value)}
                        className="bg-transparent border-2 focus:border-amber-500 p-2 rounded-md h-20"
                        placeholder="Main Line"
                    ></textarea>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-transparent border-2 focus:border-amber-500 p-2 rounded-md h-40"
                        placeholder="Description"
                    ></textarea>
                    <div className="flex space-x-4">
                        <button onClick={handleEdit} className="bg-amber-100 text-white p-2 rounded-lg">修改</button>
                        <button onClick={handleDelete} className="bg-red-400 text-white p-2 rounded-lg">删除</button>
                    </div>
                </div>
            </div>
        )}
        {selectedLink && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative bg-white dark:bg-slate-500  rounded-lg shadow-lg p-4">
            
                <button 
                    className="absolute top-3 right-3 bg-gray-200 dark:bg-slate-400 p-2 rounded-full focus:outline-none"
                    onClick={() => setSelectedLink(null)}
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl mb-4 text-black dark:text-white">编辑链接</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="upstream_id" className="block text-sm font-medium text-black dark:text-white">上游:</label>
                        <Select
                            classNamePrefix="react-select"
                            unstyled={true}   
                            value={{ value: upstream_id, label: points.find(option => option.id === upstream_id)?.title }}
                            options={points.map(point => ({ value: point.id, label: point.title }))}
                            onChange={option => option && setUpstreamId(option.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="downstream_id" className="block text-sm font-medium text-black dark:text-white">下游:</label>
                        <Select
                            classNamePrefix="react-select"
                            unstyled={true}   
                            value={{ value: downstream_id, label: points.find(option => option.id === downstream_id)?.title }}
                            options={points.map(point => ({ value: point.id, label: point.title }))}
                            onChange={option => option && setDownstreamId(option.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-black dark:text-white">权重:</label>
                        <input 
                            type="number" 
                            id="weight" 
                            name="weight" 
                            value={weight.toString()}  // 转换为字符串
                            onChange={(e) => setWeight(Number(e.target.value))}  // 转换为数字
                            className="mt-1 px-4 py-2 w-full border rounded-md dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button onClick={handleAddLink} className="px-4 py-2 bg-amber-100 dark:bg-slate-500 border rounded-md hover:bg-amber-200 dark:hover:bg-slate-600">添加</button>
                        <button onClick={handleEditLink} className="px-4 py-2 bg-amber-100 dark:bg-slate-500 border rounded-md hover:bg-amber-200 dark:hover:bg-slate-600">修改</button>
                        <button onClick={handleDeleteLink} className="px-4 py-2 bg-red-400 border rounded-md hover:bg-red-500 text-white">删除</button>
                    </div>
                </div>
            </div>
        </div>
            
        )}
         <div className='mt-11'>
           <svg ref={svgRef}></svg>            
        </div>
        <div className="fixed top-0 left-0 h-screen w-full  flex z-50 justify-end items-start p-4 overflow-hidden pointer-events-none">
        <button
            className="fixed top-2 right-14 focus:outline-none z-50 pointer-events-auto"
            onClick={toggleDrawer}
        >
        {isOpen ? (
            <XMarkIcon className="h-8 w-8" />
        ) : (
            <DocumentPlusIcon className="h-8 w-8" />
        )}
        </button>

        <AnimatePresence>
        {isOpen && (
            <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 right-0 h-full bg-white dark:bg-slate-600 shadow-lg p-4 pointer-events-auto"
            >
                <div>
                    <h1 className="text-2xl mb-4">Add Point</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                        <label className="block mb-1">标题:</label>
                        <input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className={`border rounded p-2 w-full ${titleError ? 'border-red-500' : 'border-gray-300'}`} 
                        />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">详细:</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded p-2 w-full h-32" />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">主线:</label>
                            <input 
                                list="mainlines" 
                                value={main_line} 
                                onChange={(e) => setMainLine(e.target.value)} 
                                className="border rounded p-2 w-full" 
                            />
                            <datalist id="mainlines">
                                <option value="数域拓展" />
                                <option value="数量关系" />
                                <option value="谜题游戏" />
                                <option value="空间观念" />
                                <option value="分析推理" />
                                <option value="应用意识" />
                                <option value="运算技能" />
                                <option value="代数关系" />
                                <option value="计算原理" />
                                <option value="特殊技巧" />
                            </datalist>
                        </div>
                        {upstreamPoints.map((point, index) => (
                            <div key={index} className="mb-2 flex items-center">
                                <label className="block mb-1 mr-2">上游知识点:</label>
                                <Select
                                    unstyled={true}                                        
                                    classNamePrefix="react-select"
                                    options={options}
                                    value={{ value: upstreamPoints[index].id,label: points.find(option => option.id === upstreamPoints[index].id )?.title || "" }}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            handleUpstreamPointChange(index, 'id', selectedOption.value);
                                        }
                                    }}
                                    className="rounded  w-36 mr-2 border hover:outline-black flex-grow"
                                />

                                <label className="block mb-1 mr-2">权重:</label>
                                <input 
                                    type="number" 
                                    value={point.weight} 
                                    onChange={(e) => handleUpstreamPointChange(index, 'weight', Number(e.target.value))} 
                                    min="1"
                                    className="border rounded p-2 w-16"
                                />
                            </div>
                        ))}
                        <div className="mb-2">
                            <button type="button" onClick={handleAddUpstreamPoint} className="border rounded p-2 mr-2">+ 添加</button>
                            <button type="button" onClick={handleRemoveUpstreamPoint} className="border rounded p-2">- 删除</button>
                        </div>
                        <button type="submit" className="bg-amber-100 rounded p-2">Submit</button>
                    </form>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
        </div>
        </div>
    );
    }

    export default Stars;