import React, {useState, useEffect, useContext} from "react";
import {POST} from "../../../contexts/fetch-action";
import { Document, Page, pdfjs } from "react-pdf";
import SearchContext from "../store/search-context";
import AuthContext from "../../../components/auth-store/auth-context";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {jwtDecode} from "jwt-decode";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


type Props = {
     visibleOption : boolean | undefined
}


const PdfView:React.FC<Props> = (props) => {

    // 마우스 우클릭 방지
    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => event.preventDefault()

    // 0. Variables
    const searchCtx = useContext(SearchContext);
    const authCtx = useContext(AuthContext);
    const [numPages, setNumPages] = useState<number >(1);
    const [loadPage, setLoadPage] = useState<number | undefined>(1);
    const [pageNumber, setPageNumber] = useState(20);
    const pagesPerChunk = 50;
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => setNumPages(numPages);
    const [hoveredRow, setHoveredRow] = useState(0);
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const createTokenHeader = (token:string) => {
         return {
           headers: {
             'Authorization': 'Bearer ' + token
           }
           ,responseType: 'arraybuffer'
         }
       }


    //1. Onload
    useEffect(() => {

        if (searchCtx.fileDetail?.tmpName !== undefined) {
          searchSubmit();
        }
    }, [searchCtx.fileDetail?.tmpName]);


    //2. 파일가져옴
    const searchSubmit = () => {
        var body={
            tmpName: searchCtx.fileDetail?.tmpName
            , fileExt:  searchCtx.fileDetail?.fileExt
        }

        const response = POST("/api/pdf/pdfview", body,{
                  headers: { 'Authorization': 'Bearer ' + authCtx.token },
                  responseType: 'arraybuffer'});
            response.then(response => {
            const pdfBlob = new Blob([response?.data], { type: 'application/pdf' });
            const pdfDataUrl = URL.createObjectURL(pdfBlob);
            setPdfData(pdfDataUrl);
        }).catch(error => {
           console.error("Error in fetching the file:", error);
        });

    }
    
    //3. 페이지 온로드
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if ((pageNumber + pagesPerChunk) <= (numPages ?? 1)) {
          setPageNumber(pageNumber + pagesPerChunk);
        }else if((pageNumber + pagesPerChunk)%50<50) {
            setPageNumber(numPages);
        }
      }, 3000);

      return () => clearTimeout(timeoutId);
    }, [pageNumber, numPages, pagesPerChunk]);


    //4. 페이지 랜더링
    const renderPages = () => {
        const pages = [];
        if (!pageNumber) return null

        for (let i = 1; i <= pageNumber; i++) {
          pages.push(
               <tr className={`tr-cell ${hoveredRow === i ? 'hovered-row' : ''}`}
                   key={i}
                   onClick={() => setLoadPage(i)}
                   onMouseEnter={()=>setHoveredRow(i)}
                   onMouseLeave={()=>setHoveredRow(0)}>
                   <td align="center" className="sidebar-number">
                       <b>{i}</b>
                       {searchCtx.fileDetail?.reqCode === 3   && ["pptx", "ppt"].includes(searchCtx.fileDetail?.fileExt ) && !props.visibleOption &&(
                         <button className="border-none border-block pointer-option" onClick={()=>handleDownClick(i)}>
                             <img width='32px' src='/images/down7.png'/>
                         </button>
                       )}
                   </td>
                   <td align="center" >
                       <div className="check-div">
                           <Page pageNumber={i} width={250} height={180} />
                           {searchCtx.fileDetail?.reqCode === 3   && ["pptx", "ppt"].includes(searchCtx.fileDetail?.fileExt) && !props.visibleOption && (
                               <input className="check-option" type="checkbox"
                                      name="check_no"
                                      value={i}
                                      checked={checkedItems[i]|| false}
                                      onChange={() => handleCheckboxChange(i)}
                               />
                           )}
                       </div>
                   </td>
               </tr>
          );
        }
        return <>{pages}</>;
    };

    //5. 파일 download 구현중
    const handleDownClick =(index:number)=>{
        let saveName = searchCtx.fileDetail?.saveName ?? ''
        let projectName=index+(searchCtx.fileDetail?.projectName ?? '')
        const saveNameWithoutExtension = searchCtx.fileDetail?.saveName.substring(0, saveName.lastIndexOf("."));
        const convertToPptx = index+"_"+saveName

        let pptxName = saveNameWithoutExtension+"/"+convertToPptx;
        let newFileName = index+"_"+projectName+".pptx";

        let body={
            projectName:index+projectName,
            fileName:pptxName,
            type:2
        }

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

    //체크박스 클릭시
    //페이지 수가 변경되면 checkedItems 배열을 초기화
    useEffect(() => {
      setCheckedItems(new Array(numPages ?? 0).fill(false));
    }, [numPages]);

    const handleCheckboxChange = (index:number) => {
       const updatedCheckedItems = [...checkedItems];
       updatedCheckedItems[index] = !updatedCheckedItems[index];
       setCheckedItems(updatedCheckedItems);

        // 체크된 항목들의 인덱스 배열 만들기
        const checkedIndexes = updatedCheckedItems
            .map((isChecked, i) => (isChecked ? `${i}_${searchCtx.fileDetail?.saveName}` : null))
            .filter((index): index is string => index !== null);

        searchCtx.setExportedIndexes(checkedIndexes);
     };

    

    return(

        <div className="iframe-outline"  onContextMenu={handleContextMenu}>
                        <div className="iframe-body">
                            <div className="iframe-sidebar">
                                <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
                                  <table className="sidebar-table">
                                         <colgroup>
                                             <col width="10%"/>
                                             <col width="90%"/>
                                         </colgroup>
                                        <tbody>
                                        {renderPages()}
                                        </tbody>
                                    </table>

                              </Document>
                            </div>
                             <div className="iframe-slider-img">
                                 <div id="slider-wrap" onContextMenu={handleContextMenu}>

                                            <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
                                                <Page pageNumber={loadPage} />
                                            </Document>
                                             {/*{loadPage}*/}
                                             {/*       <p>*/}
                                             {/*         <button onClick={()=> pageNumber > 1 ? setPageNumber(pageNumber-1):null}>*/}
                                             {/*         &lt;*/}
                                             {/*         </button>*/}
                                             {/*         <span>Page {pageNumber} of {numPages}</span>*/}
                                             {/*           <button onClick={() => pageNumber < (numPages ?? 1) ? setPageNumber(pageNumber + 1) : null}>*/}
                                             {/*         &gt;*/}
                                             {/*         </button>*/}
                                             {/*       </p>*/}
                                 </div>
                             </div>
                     </div>
                 </div>
    )
}

    export default PdfView;