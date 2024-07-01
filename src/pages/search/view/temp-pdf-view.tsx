import React, {useState, useEffect, useContext} from 'react';
import {POST} from "../../../contexts/fetch-action";
import AuthContext from "../../../components/auth-store/auth-context";
import SearchContext from "../store/search-context";


/*현재 사용안함*/
export default function TempPdfView() {
    const authCtx = useContext(AuthContext);
    const searchCtx = useContext(SearchContext);
    const [sliceData, setSliceData] = useState<undefined | string>();

    //1. onload
    useEffect(() => {
        getPdfSlice();
    }, []);

    //2. 슬라이스 가져오기
    const getPdfSlice= async() => {
        searchCtx.getPdfSlice("20230901094259419.pdf",authCtx.token);
    }

    useEffect(()=>{
        var slide=searchCtx.pdfFirstSlice;
        setSliceData(slide);
    },[searchCtx.pdfFirstSlice]);


    //3. download
    const handleDownClick =(index:number)=>{

        const createTokenHeader = (token:string) => {
          return {
            headers: {
              'Authorization': 'Bearer ' + token
            }
            ,responseType: 'arraybuffer'
          }
        }

        var saveName = searchCtx.fileDetail?.saveName ?? ''
        var projectName=index+(searchCtx.fileDetail?.projectName ?? '')

        const saveNameWithoutExtension = searchCtx.fileDetail?.saveName.substring(0, saveName.lastIndexOf("."));
        const convertToPptx = index+"_"+saveName

        var pptxName = saveNameWithoutExtension+"/"+convertToPptx;
        var newFileName = index+"_"+projectName+".pptx";

        var body={
              projectName:index+projectName,
              fileName:pptxName,
              type:2
          }

        // createTokenHeader(token)
        const response = POST("/file/download",body, createTokenHeader(authCtx.token));

        response.then(response => {
            if (response && response.data) {
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = newFileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
        } else {
          console.error("Error in response or data is null");
        }
      }).catch(error => {
        console.error("Error in fetching the file:", error);
      });

    }

    //5. Mouse Handeler
    const [hoveredRow, setHoveredRow] = useState(0);
    const handleMouseEnter = (index:number) => {
        setHoveredRow(index);
    };
    const handleMouseLeave = () => {
        setHoveredRow(0);
    };

    //4. 사이드바 클릭시 슬라이더 변경
    const changeSlider =(index:number,slice:string)=>{
        setSliceData(slice);
    }

    //2. Error 발생시
    const [hasError, setHasError] = useState(false);
    const handleError = () => {
      setHasError(true);
    };

    // 우클릭방지
    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
    };

    //체크박스 클릭시
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const handleCheckboxChange = (index:number) => {
       const updatedCheckedItems = [...checkedItems];

       updatedCheckedItems[index] = !updatedCheckedItems[index];
       setCheckedItems(updatedCheckedItems);

        // 체크된 항목들의 인덱스 배열 만들기
        const checkedIndexes = updatedCheckedItems
            .map((isChecked, i) => (isChecked ? `${i + 1}_${searchCtx.fileDetail?.saveName}` : null))
            .filter((index): index is string => index !== null);

        searchCtx.setExportedIndexes(checkedIndexes);
     };


return(

   <div className="iframe-outline"  onContextMenu={handleContextMenu}>
                   <div className="iframe-body">
                       <div className="iframe-sidebar">
                          <table className="sidebar-table">
                               <colgroup>
                                   <col width="10%"/>
                                   <col width="90%"/>
                               </colgroup>
                              <tbody>

                              {searchCtx.pdfSlice?.map((slice: string, index: number) => (
                                         <tr key={index}
                                            className={`tr-cell ${hoveredRow === index ? 'hovered-row' : ''}`}
                                             onClick={()=> changeSlider(index+1, slice)}
                                             onMouseEnter={() => handleMouseEnter(index)}
                                             onMouseLeave={handleMouseLeave}>

                                             <td align="center" className="sidebar-number">
                                                 <b>{index+1}</b>
                                                 {searchCtx.fileDetail?.reqCode === 3 && searchCtx.fileDetail?.fileExt =="pptx" && (
                                                   <button className="border-none border-block pointer-option" onClick={()=>handleDownClick(index+1)}>
                                                       <img width='32px' src='/images/down7.png'/>
                                                   </button>
                                                 )}
                                             </td>

                                             <td align="center" >
                                                 <div className="check-div">
                                                     <img id="slider-img" src={slice} className="sidebar-picture" />
                                                     {searchCtx.fileDetail?.reqCode === 3 && searchCtx.fileDetail?.fileExt =="pptx" && (
                                                     <input className="check-option" type="checkbox"
                                                            name="check_no"
                                                            value={index + 1}
                                                            checked={checkedItems[index] || false}
                                                            onChange={() => handleCheckboxChange(index)}/>
                                                     )}
                                                 </div>
                                             </td>
                                         </tr>
                                   ))}
                              </tbody>
                          </table>
                       </div>
                       <div className="iframe-slider-img">
                           <div id="slider-wrap">
                               <ul id="slider">
                                   <li>
                                       <img id="slider-img" src={sliceData} onError={handleError} style={{ display: hasError ? 'none' : 'block' }}/>
                                   </li>
                               </ul>
                           </div>
                       </div>
                   </div>
               </div>
)
}