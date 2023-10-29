"use client"
import Image from "next/image";

export default function Footer(){
    return (
        <div className="fixed flex justify-center items-center w-screen bottom-0 text-[0.5rem] text-gray-400 flex-row gap-4">
            <div className="flex shrink-0 items-center gap-1 "> 
                <img src="/FilingIcon.png" width={14} height={14} alt="备案图标" className="h-3 w-3" />
                <a target="_blank" rel="noopener noreferrer" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502053253">                    
                    京公网安备 11010502053253号
                </a>
            </div>   
            <a className="shrink-0 " target="_blank" rel="noopener noreferrer" href="https://beian.miit.gov.cn/#/Integrated/index" >
                京ICP备   2020034692号-2
            </a>
        </div>
    );
};  