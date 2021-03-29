import React, { useRef, useEffect ,} from 'react';
import WebViewer from '@pdftron/webviewer';
import {useParams} from "react-router-dom"
import './Editor.css';
import axios from "axios";
import pdf from "./pdf/FM.pdf";
const Editor = () => {
  const viewer = useRef(null);
 let url_id =useParams();
  // if using a class, equivalent of componentDidMount 
  useEffect(() => {

    console.log(url_id._id);
    axios.get("/exam/getExamDetails/"+url_id._id)
    .then((data) => {

      console.log(data);

    }).catch(e=>{
      console.log(e);
    })
    WebViewer(
      {
        path: 'lib',
        initialDoc:'http://www.africau.edu/images/default/sample.pdf',
      },
      viewer.current,
    ).then((instance) => {
      const { docViewer, Annotations } = instance;
      const annotManager = docViewer.getAnnotationManager();
      docViewer.on('documentLoaded', () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation();
        rectangleAnnot.PageNumber = 1;
        // values are in page coordinates with (0, 0) in the top left
        rectangleAnnot.X = 100;
        rectangleAnnot.Y = 150;
        rectangleAnnot.Width = 200;
        rectangleAnnot.Height = 50;
        rectangleAnnot.Author = annotManager.getCurrentUser();

        annotManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  return (
    <div className="Editor">
      <div className="test_paper">
      <div className="container_details_only">
      <div className="student_details">
        <h3 className="title_is">Student Details</h3>
        {/* <div className="hr_border"></div> */}
        <div className="name_editor">
          <span>Name:</span>
          <span className="name_is">Pinky Sharma</span>
        </div>
        <div className="roll_is">
          <span>Roll No:</span>
          <span>1916234</span>

        </div>
        <div className="sub_is">
          <span>Subject:</span>
          <span>Data Structure</span>
        </div>
      </div>
      </div>
      <div className="embed_container">
      <embed src= {pdf}  height="654.99px"/>
      </div>
      </div>

      <div className="editor_section">
        <div className="remarks_container">
          <div className="remarks">
              <div><span className="remarks_title">Question no:</span> <span className="nos1"><span>1</span><span>2</span><span>3</span></span></div>
              <br/>
              <div><span className="remarks_title">Marks:</span> <span className="nos2"><span>2</span><span>2</span><span>1</span></span> </div>
          </div>
        </div>
        <div className="view_content">
          <div className="webviewer" ref={viewer}></div>
        </div>
      </div>
    </div>
  );
};

export default Editor;