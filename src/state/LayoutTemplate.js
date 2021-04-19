import {makeAutoObservable} from "mobx";
import {css, unsafeCSS} from "lit-element";

export class LayoutTemplate {

  content
  templateAreas
  isErrorParseAreas
  #templateChanges

  constructor(data = {}) {
    makeAutoObservable(this);
    this.id = data.id;
    this.template = data.template;
    this.content = data.content;
    this.form = data.form;
    this.templateAreas = [['x1x1']];
    this.isErrorParseAreas = false;
    this.#templateChanges = [];
  }

  // parseFieldNameAreas() {
  //   const content = this.content;
  //   const template = document.createElement('template');
  //   template.innerHTML = content.toString();
  //   const container = template.content.querySelector('[data-container-id]');
  //   const aaa = css`.eqweqweqewqwe {grid-template-columns:  1fr 1fr 1fr; grid-template-areas:'x1x1 x1x2 x1x2''x2x1 x1x2 x1x2''x3x1 x1x2 x1x2'}`;
  //   console.log(`container: `, container);
  //   return container.style.gridTemplateAreas.split('" "')
  //     .map(area => area.replaceAll('"', '').split(' '));
  // }
  parseFieldNameAreas() {
    const content = this.content;
    const template = document.createElement('template');
    template.innerHTML = content.toString();
    const stylesString = template.content.getElementById('corewebEditor').innerText;
    const styles = unsafeCSS(stylesString);
    const gridTemplateAreas = styles.styleSheet.cssRules.item('corewebEditor').style.gridTemplateAreas;
    console.log(`gridTemplateAreas: `, gridTemplateAreas);
    return gridTemplateAreas.split('" "')
      .map(area => area.replaceAll('"', '').split(' '));
  }

  mapLayoutDefinitionsToAreas(fieldLayoutDefinitions) {
    const layoutTemplate = this;
    try {
      layoutTemplate.isErrorParseAreas = false;
      const fieldAreas = layoutTemplate.parseFieldNameAreas();
      const templateAreas = [...fieldAreas];
      const areaToFieldNameMap = new Map();
      const fieldLayoutDefinitionsMap = new Map();
      fieldAreas.forEach((fieldAreas, line) => {
        fieldAreas.forEach((fieldName, col) => {
          let area = `x${line + 1}x${col + 1}`;
          if (areaToFieldNameMap.has(fieldName)) {
            area = areaToFieldNameMap.get(fieldName);
          } else {
            areaToFieldNameMap.set(fieldName, area);
            const layout = fieldLayoutDefinitions.find(({field}) => field.fieldName === fieldName);
            fieldLayoutDefinitionsMap.set(area, layout);
          }
          templateAreas[line][col] = area;
        });
      });
      layoutTemplate.templateAreas = templateAreas;
      return fieldLayoutDefinitionsMap;
    } catch (e) {
      layoutTemplate.isErrorParseAreas = true;
    }
  }

  mapDefaultLayoutDefinitionsToAreas(fieldLayoutDefinitions) {
    const fieldLayoutDefinitionsMap = new Map();
    const templateAreas = [];
    fieldLayoutDefinitions.forEach((layout, index) => {
      const area = `x${index + 1}x1`;
      fieldLayoutDefinitionsMap.set(area, layout);
      templateAreas.push([area]);
    });
    this.templateAreas = templateAreas;
    return fieldLayoutDefinitionsMap;
  }

  addRow() {
    this.saveState();
    const layoutTemplate = this;
    const rows = layoutTemplate.templateAreas.length+1;
    let row = [];
    layoutTemplate.templateAreas[0].forEach((ta, i) => {
      row[i] = `x${rows}x${i+1}`;
    })
    layoutTemplate.templateAreas.push(row);
  }

  addColumn() {
    this.saveState();
    const {templateAreas} = this;
    const cols = templateAreas[0].length+1;
    templateAreas.forEach((ta, i)=>{
      ta.push(`x${i+1}x${cols}`)
    })
  }

  deleteRow() {
    const layoutTemplate = this;
    const {templateAreas} = layoutTemplate;
    if (layoutTemplate.templateAreas.length > 1) {
      this.saveState();
      templateAreas.pop();
    }
  }

  deleteColumn() {
    const {templateAreas} = this;
    const cols = templateAreas[0].length;
    if (cols > 1) {
      this.saveState();
      templateAreas.forEach((ta, i) => {
        ta.pop();
      });
    }
  }

  splitCell(area) {
    this.saveState();
    // let area = this.hoverCell.area;
    const layoutTemplate = this;
    layoutTemplate.templateAreas.forEach((row,i)=>{
      row.forEach((cell,j)=> {
        if (cell === area) {
          layoutTemplate.templateAreas[i][j] = `x${i+1}x${j+1}`;
        }
      })
    });
  }

  joinCell(cell1, cell2) {
    this.saveState();
    const layoutTemplate = this;
    const {templateAreas} = layoutTemplate;
    let [,row1,col1] = cell1.split('x');
    let [,row2,col2] = cell2.split('x');
    let rows = [];
    let cols = [];
    templateAreas.forEach((row, i)=>{
      row.forEach((cell,j)=> {
        let [, r, c] = cell.split('x');
        if ((row1 == r && col1 == c) || (row2 == r && col2 == c)) {
          rows.push(i+1);
          cols.push(j+1);
        }
      })
    })
    let points = {rowMin: Math.min(...rows), rowMax: Math.max(...rows), colMin: Math.min(...cols), colMax: Math.max(...cols)};
    const len = points.colMax-points.colMin+1;
    let fillArray = new Array(len).fill(`x${row1}x${col1}`);
    for (let i=0; i<=points.rowMax-points.rowMin; i++)
      templateAreas[points.rowMin-1+i].splice(points.colMin-1, len, ...fillArray);
    //this.getSelection().classList.remove('selected');
    // this.hoverCell = null;
    // this.#mergeLayoutsWithAreas();
    // this.update(templateAreas);
  }

  saveState(state = JSON.parse(JSON.stringify(this.templateAreas))) {
    if (this.#templateChanges.length > 20)
      this.#templateChanges.shift();
    this.#templateChanges.push(state);
  }

  undo() {
    if (this.#templateChanges.length > 0) {
      this.templateAreas = this.#templateChanges.pop();
    }
  }

  makeTemplateContent() {
    const {templateAreas} = this;
    const columns = templateAreas[0].reduce((res) => res + ' 1fr', 'grid-template-columns: ');
    const layoutDefinitions = this.form.fieldLayoutDefinitions;
    const fieldAreas = templateAreas.map(areas =>
      areas.map(area => layoutDefinitions.get(area).field.fieldName));
    const areas = fieldAreas.reduce((res, row) => `${res}'${row.join(' ')}'`, 'grid-template-areas:');
    const content = `<!-- Generated with visual coreweb editor -->
<div class="corewebEditor" data-container-id="Fields"></div>
<style id="corewebEditor">
.corewebEditor {
  display: grid;
  ${columns};
  ${areas};
}
</style>`;
    this.content = content;
    console.log('layoutTemplate -> content', content)
    return content;
  }

  fromDatabean(databean) {
    this.id = databean.rootId;
    this.type = databean.type;
    this.template = databean.values?.template;
    this.content = databean.values?.template?.content;
    this.databean = databean;
    return this;
  }

}
