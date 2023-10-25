'use client'
import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Select from 'react-select';

const Stars = () => {
    interface Point {
        id: number;
        title: string;
        description: string;
        main_line:string;
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

    const svgRef = useRef(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [remInPixels, setRemInPixels] = useState<number>(16); 
    const [isOpen, setIsOpen] = useState(false);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [main_line, setMainLine] = useState('');

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

    useEffect(() => {
        fetchAndUpdateGraph();
        setRemInPixels(parseFloat(getComputedStyle(document.documentElement).fontSize))
    }, []);

    const options = points.map(p => ({ value: p.id, label: p.title }));

    useEffect(() => {
        if (!points.length) return;

        const width = window.innerWidth;
        const height = window.innerHeight;            
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);
        const macaronColorScheme = {
            "数域拓展": "#FF6B6B", // 粉红
            "数量关系": "#FFA07A", // 橙色
            "谜题游戏": "#FFF68F", // 浅黄
            "空间观念": "#98FB98", // 浅绿
            "分析推理": "#CCCCFF", // 紫罗兰色（Periwinkle）
            "应用意识": "#B0E0E6", // 淡蓝
            "运算技能": "#D8BFD8", // 轻紫
            "代数关系": "#40E0D0", // 青色（Turquoise）
            "计算原理": "#FFDAB9",  // 天青色（Sky Blue）
            "特殊技巧": "#87CEEB"   // 淡橙色（Apricot）
        };

        svg.selectAll("*").remove();

        const container = svg.append("g");
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on("zoom", (event) => {
                container.attr("transform", event.transform);
            });
        svg.call(zoom as any);

        const simulation = d3.forceSimulation(points)
            .force("link", d3.forceLink(links)
                .id(d => d.id)
                .distance(link => {
                    const sourceRadius = link.source.title.length * 0.4 * remInPixels;
                    const targetRadius = link.target.title.length * 0.4 * remInPixels;
                    return (sourceRadius + targetRadius)*1.5 ;
                })
            )
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));
        
        // 定义箭头的marker
        svg.append("defs").selectAll("marker")
            .data(links)
            .enter().append("marker")
            .attr("id", d => "arrow" + d.target.id) // 使用目标节点的id创建唯一的id
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 9) // 动态地设置refX值
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5L5,0Z")
            .attr("fill", "#999");

        const link = container.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .attr("stroke", "gray")
            .attr("marker-end", d => "url(#arrow" + d.target.id + ")")
            .on('click', function(event, d) {
                setSelectedLink(d);
                setUpstreamId(d.upstream_id);
                setDownstreamId(d.downstream_id);
                setWeight(d.weight);
            });
    
        const node = container.selectAll(".node")
            .data(points)
            .enter().append("g");
        
        node.append("circle")
            .attr("class", "node")
            .attr("r", d => d.title.length * 0.4 * remInPixels)
            .attr("fill", d => macaronColorScheme[d.main_line] || "rgb(255, 251, 235)") // 使用颜色映射或默认颜色
            .on('click', function(event, d) {
                setSelectedNode(d);
                setTitle(d.title);
                setDescription(d.description);
                setMainLine(d.main_line);
            });
        
        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .text(d => d.title)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .style("pointer-events", "none");

        simulation.nodes(points).on("tick", function () {
            link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", function(d) {
                if (isNaN(d.target.x) || isNaN(d.source.x)) return 0;
                const deltaX = d.target.x - d.source.x;
                const deltaY = d.target.y - d.source.y;
                const angle = Math.atan2(deltaY, deltaX);
                const radius = d.target.title.length * 0.4 * remInPixels;
                return d.target.x - Math.cos(angle) * radius;
            })
            .attr("y2", function(d) {
                if (isNaN(d.target.y) || isNaN(d.source.y)) return 0; 
                const deltaX = d.target.x - d.source.x;
                const deltaY = d.target.y - d.source.y;
                const angle = Math.atan2(deltaY, deltaX);
                const radius = d.target.title.length * 0.4 * remInPixels;
                return d.target.y - Math.sin(angle) * radius;
            });
        
            node.attr("transform", d => `translate(${d.x}, ${d.y})`);
        });                
    }, [points, links]);

    //添加提示框部分
    const [upstreamPoints, setUpstreamPoints] = useState([{ id: '', weight: 1 }]);
    const [titleError, setTitleError] = useState(false); // 新增state
            
    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleAddUpstreamPoint = () => {
        setUpstreamPoints([...upstreamPoints, { id: '', weight: 1 }]);
    };
    const handleRemoveUpstreamPoint = () => {
        if (upstreamPoints.length > 1) {
            const newPoints = [...upstreamPoints];
            newPoints.pop();
            setUpstreamPoints(newPoints);
        }
    };
    
    const handleUpstreamPointChange = (index, key, value) => {
        const updatedPoints = [...upstreamPoints];
        updatedPoints[index][key] = value;
        setUpstreamPoints(updatedPoints);
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
            setUpstreamPoints([{ id: '', weight: 1 }]);
            await fetchAndUpdateGraph();
        }
    }

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

    
    return (
        <div className='absolute flex justify-center items-center w-full h-full'>
            {selectedNode && (
                <div className="fixed top-14 w-1/2 bottom-10 bg-white shadow dark:bg-slate-600 p-4 rounded-lg overflow-y-auto">
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
                                value={points.find(option => option.id === upstream_id)}
                                options={points.map(point => ({ value: point.id, label: point.title }))}
                                onChange={option => setUpstreamId(option.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="downstream_id" className="block text-sm font-medium text-black dark:text-white">下游:</label>
                            <Select
                                value={points.find(option => option.id === downstream_id)}
                                options={points.map(point => ({ value: point.id, label: point.title }))}
                                onChange={option => setDownstreamId(option.value)}
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
            <svg ref={svgRef}></svg>
            <div className="fixed top-0 left-0 h-screen w-full  flex z-50 justify-end items-start p-4 overflow-hidden pointer-events-none">
                <button
                    className="fixed top-2 right-14 focus:outline-none z-50 pointer-events-auto"
                    onClick={toggleDrawer}
                >
                {isOpen ? (
                    <XMarkIcon className="h-8 w-8" />
                ) : (
                    <FolderIcon className="h-8 w-8" />
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
                                            options={options}
                                            value={options.find(option => option.value === point.id)}
                                            onChange={(selectedOption) => handleUpstreamPointChange(index, 'id', selectedOption.value)}
                                            className="border rounded p-2 mr-2 flex-grow"
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
};

export default Stars;
