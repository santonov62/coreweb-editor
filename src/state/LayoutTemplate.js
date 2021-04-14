import {makeAutoObservable} from "mobx";

export class LayoutTemplate {

  content
  templateAreas
  #templateChanges;

  constructor(data = {}) {
    makeAutoObservable(this);
    this.id = data.id;
    this.template = data.template;
    this.content = data.content;
    this.form = data.form;
    this.templateAreas = [['x1x1']];
    this.#templateChanges = [];
  }

  parseFieldNameAreas() {
    const content = this.content;
    const template = document.createElement('template');
    template.innerHTML = content.toString();
    const container = template.content.querySelector('[data-container-id]');
    console.log(`container: `, container);
    return container.style.gridTemplateAreas.split('" "')
      .map(area => area.replaceAll('"', '').split(' '));
  }

  mapLayoutDefinitionsToAreas(fieldLayoutDefinitions) {
    const layoutTemplate = this;
    const fieldAreas = layoutTemplate.parseFieldNameAreas();
    const templateAreas = [...fieldAreas];
    const areaToFieldNameMap = new Map();
    const fieldLayoutDefinitionsMap = new Map();
    fieldAreas.forEach((fieldAreas, line) => {
      fieldAreas.forEach((fieldName, col) => {
        let area = `x${line}x${col}`;
        if (areaToFieldNameMap.has(fieldName)) {
          area = areaToFieldNameMap.get(fieldName);
        } else {
          areaToFieldNameMap.set(fieldName, area);
          const layout = fieldLayoutDefinitions.find(({field}) => field.fieldName === fieldName);
          // // TODO fix area bind
          // layout.area = area;
          fieldLayoutDefinitionsMap.set(area, layout);

        }
        templateAreas[line][col] = area;
      });
    });
    layoutTemplate.templateAreas = templateAreas;
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
<div data-container-id="Fields" style="display: grid;${columns};${areas};"></div>`;
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
