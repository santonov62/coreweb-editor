import {makeAutoObservable, runInAction} from "mobx";
import {css, unsafeCSS} from "lit-element";
import {FieldLayoutDefinition} from "./FieldLayoutDefinition";

export class LayoutTemplate {

  content
  templateAreas
  isErrorParseAreas
  fieldLayoutDefinitions
  #templateChanges

  constructor(data = {}) {
    makeAutoObservable(this);
    this.id = data.id;
    this.template = data.template;
    this.content = data.content;
    this.form = data.form;
    this.templateAreas = [['x1x1']]
    this.fieldLayoutDefinitions = new Map([['x1x1', new FieldLayoutDefinition()]]);
    // this.form.newFieldLayoutDefinition(`x1x1`);
    this.isErrorParseAreas = false;
    this.#templateChanges = [];
  }

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
      layoutTemplate.fieldLayoutDefinitions = fieldLayoutDefinitionsMap;
      return fieldLayoutDefinitionsMap;
    } catch (e) {
      layoutTemplate.isErrorParseAreas = true;
    }
  }

  newFieldLayoutDefinition(area) {
    const fieldLayoutDefinition = new FieldLayoutDefinition();
    runInAction(() =>
      this.fieldLayoutDefinitions.set(area, fieldLayoutDefinition)
    )
    return fieldLayoutDefinition;
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
    this.fieldLayoutDefinitions = fieldLayoutDefinitionsMap;
    return fieldLayoutDefinitionsMap;
  }

  addRow() {
    this.saveState();
    const layoutTemplate = this;
    const rows = layoutTemplate.templateAreas.length+1;
    let row = [];
    layoutTemplate.templateAreas[0].forEach((ta, i) => {
      const area = `x${rows}x${i+1}`;
      this.syncLayoutsWithAreas(area);
      row[i] = area;
    })
    layoutTemplate.templateAreas.push(row);
  }

  addColumn() {
    this.saveState();
    const {templateAreas} = this;
    const cols = templateAreas[0].length+1;
    templateAreas.forEach((ta, i)=>{
      const area = `x${i+1}x${cols}`;
      this.syncLayoutsWithAreas(area);
      ta.push(area);
    })
  }

  syncLayoutsWithAreas(area) {
    if (!this.fieldLayoutDefinitions.has(area)) {
      this.newFieldLayoutDefinition(area);
    }
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
          const area = `x${i+1}x${j+1}`;
          layoutTemplate.templateAreas[i][j] = area;
          this.syncLayoutsWithAreas(area);
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
    const area = `x${row1}x${col1}`;
    let fillArray = new Array(len).fill(area);
    for (let i=0; i<=points.rowMax-points.rowMin; i++)
      templateAreas[points.rowMin-1+i].splice(points.colMin-1, len, ...fillArray);
    this.syncLayoutsWithAreas(area);

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
    const {templateAreas, fieldLayoutDefinitions} = this;
    const columns = templateAreas[0].reduce((res) => res + ' 1fr', 'grid-template-columns: ');
    const fieldAreas = templateAreas.map(areas =>
      areas.map(area => fieldLayoutDefinitions.get(area).field.fieldName));
    const areas = fieldAreas.reduce((res, row) => `${res}\n\t'${row.join(' ')}'`, 'grid-template-areas:');
    const content = `<!-- Generated by visual coreweb editor -->
<div class="corewebEditor" data-container-id="Fields"></div>
<style id="corewebEditor">
.corewebEditor {
  display: grid;
  ${columns};
  ${areas};
  --color-widget-background-odd: transparent;
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
