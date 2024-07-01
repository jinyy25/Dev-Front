import React, {useState, useEffect, useContext} from "react";
import {POST} from "../../../contexts/fetch-action";
import { Document, Page, pdfjs } from "react-pdf";
import AuthContext from "../../../components/auth-store/auth-context";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;




type Props = {
    tmpName: string | undefined,
    fileExt: string | undefined
}

const ReferencePdfView:React.FC<Props> = (props) => {

    // 마우스 우클릭 방지
    const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => event.preventDefault()

    // 0. Variables
    const authCtx = useContext(AuthContext);
    const [numPages, setNumPages] = useState<number >(1);
    const [loadPage, setLoadPage] = useState<number | undefined>(1);
    const [pageNumber, setPageNumber] = useState(20);
    const pagesPerChunk = 50;
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => setNumPages(numPages);
    const [hoveredRow, setHoveredRow] = useState(0);
    const [pdfData, setPdfData] = useState<string | null>(null);


    //1. Onload
    useEffect(() => {
          searchSubmit();
       }, []);


    //2. 파일가져옴
    const searchSubmit = () => {
        var body={
            tmpName: props.tmpName
            , fileExt:  props.fileExt
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
                   </td>
                   <td align="center" >
                       <div className="check-div">
                           <Page pageNumber={i} width={250} height={180} />
                       </div>
                   </td>
               </tr>
          );
        }
        return <>{pages}</>;
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

                                 </div>
                             </div>
                     </div>
                 </div>
    )
}

    export default ReferencePdfView;