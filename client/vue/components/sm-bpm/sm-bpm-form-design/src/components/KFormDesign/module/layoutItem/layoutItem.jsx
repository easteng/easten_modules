/*
 * author kcz
 * date 2019-11-20
 * description 使用递归组件调用自己，生成布局结构及表单
 */
import draggable from 'vuedraggable';
import formNode from '../formNode';
export default {
  name: 'LayoutItem',
  components: {
    formNode,
    draggable,
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
    selectItem: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    startType: {
      type: String,
      required: true,
    },
    insertAllowedType: {
      type: Array,
      required: true,
    },
  },
  computed: {
    insertAllowed() {
      return this.insertAllowedType.includes(this.startType);
    },
  },
  methods: {
    handleShowRightMenu(e, record, trIndex, tdIndex) {
      this.$emit('handleShowRightMenu', e, record, trIndex, tdIndex);
    },
    handleSelectItem(record) {
      this.$emit('handleSelectItem', record);
    },
    handleColAdd(e, list) {
      this.$emit('handleColAdd', e, list);
    },
  },
  render() {
    let result;
    {
      /* 动态表格设计模块 start  */
    }
    if (this.record.type === 'batch') {
      result = (
        <div>
          <div
            class={{ active: this.record.key === this.selectItem.key, 'batch-box': true }}
            onClick={event => {
              event.stopPropagation();
              this.handleSelectItem(this.record);
            }}
          >
            <div class="batch-label">动态表格</div>
            <draggable
              value={this.record.list}
              onInput={value => {
                this.record.list = value;
              }}
              tag="div"
              class="draggable-box"
              group={this.insertAllowed ? 'form-draggable' : ''}
              ghostClass="moving"
              animation={180}
              handle=".drag-move"
              onStart={$event => {
                this.$emit('dragStart', $event, this.record.list);
              }}
              onAdd={$event => {
                this.$emit('handleColAdd', $event, this.record.list);
              }}
            >
              <transition-group tag="div" name="list" class="list-main">
                {this.record.list.map(item => {
                  return (
                    <formNode
                      key={item.key}
                      class="drag-move"
                      // select-item.sync={this.selectItem}
                      select-item={this.selectItem}
                      record={item}
                      config={this.config}
                      onHandleSelectItem={this.handleSelectItem}
                      onHandleColAdd={this.handleColAdd}
                      onHandleCopy={() => {
                        this.$emit('handleCopy');
                      }}
                      onHandleShowRightMenu={this.handleShowRightMenu}
                      onHandleDetele={() => {
                        this.$emit('handleDetele');
                      }}
                    />
                  );
                })}
              </transition-group>
            </draggable>
            <div
              class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'copy')}
              onClick={event => {
                event.stopPropagation();
                this.$emit('handleCopy');
              }}
            >
              <a-icon type="copy" />
            </div>
            <div
              class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'delete')}
              onClick={event => {
                event.stopPropagation();
                this.$emit('handleDetele');
              }}
            >
              <a-icon type="delete" />
            </div>
          </div>
        </div>
      );

      {
        /* 动态表格设计模块 end  */
      }
    } else if (this.record.type === 'grid') {
      {
        /* 栅格布局 start  */
      }
      result = (
        <div>
          <div
            class={{ active: this.record.key === this.selectItem.key, 'grid-box': true }}
            onClick={event => {
              event.stopPropagation();
              this.handleSelectItem(this.record);
            }}
          >
            <a-row class="grid-row" gutter={this.record.options.gutter}>
              {this.record.columns.map((colItem, idnex) => {
                return (
                  <a-col key={idnex} class="grid-col" span={colItem.span || 0}>
                    <draggable
                      value={colItem.list}
                      onInput={value => {
                        colItem.list = value;
                      }}
                      tag="div"
                      class="draggable-box"
                      group="form-draggable"
                      ghostClass="moving"
                      animation={180}
                      handle=".drag-move"
                      onStart={event => {
                        this.$emit('dragStart', event, colItem.list);
                      }}
                      onAdd={event => {
                        this.$emit('handleColAdd', event, colItem.list);
                      }}
                    >
                      <transition-group tag="div" name="list" class="list-main">
                        {colItem.list.map(item => {
                          return (
                            <layoutItem
                              key={item.key}
                              class="drag-move"
                              //  select-item.sync={this.selectItem}
                              select-item={this.selectItem}
                              start-type={this.startType}
                              insert-allowed-type={this.insertAllowedType}
                              record={item}
                              config={this.config}
                              onHandleSelectItem={this.handleSelectItem}
                              onHandleColAdd={this.handleColAdd}
                              onHandleCopy={() => {
                                this.$emit('handleCopy');
                              }}
                              onHandleShowRightMenu={this.handleShowRightMenu}
                              onHandleDetele={() => {
                                this.$emit('handleDetele');
                              }}
                            />
                          );
                        })}
                      </transition-group>
                    </draggable>
                  </a-col>
                );
              })}
            </a-row>

            <div
              class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'copy')}
              onClick={event => {
                event.stopPropagation();
                this.$emit('handleCopy');
              }}
            >
              <a-icon type="copy" />
            </div>
            <div
              class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'delete')}
              onClick={event => {
                event.stopPropagation();
                this.$emit('handleDetele');
              }}
            >
              <a-icon type="delete" />
            </div>
          </div>
        </div>
      );
      //  栅格布局 end
    } else if (this.record.type === 'card') {
      {
        /* 卡片布局 start */
      }
      result = (
        <div>
          <div
            class={{ active: this.record.key === this.selectItem.key, 'grid-box': true }}
            onClick={event => {
              event.stopPropagation();
              this.handleSelectItem(this.record);
            }}
          >
            <a-card class="grid-row" title={this.record.label}>
              <div class="grid-col">
                <draggable
                  value={this.record.list}
                  onInput={value => {
                    this.record.list = value;
                  }}
                  tag="div"
                  class="draggable-box"
                  group="form-draggable"
                  ghostClass="moving"
                  animation={180}
                  handle=".drag-move"
                  onStart={event => {
                    this.$emit('dragStart', event, this.record.list);
                  }}
                  onAdd={event => {
                    this.$emit('handleColAdd', event, this.record.list);
                  }}
                >
                  <transition-group tag="div" name="list" class="list-main">
                    {this.record.list.map(item => {
                      return (
                        <layoutItem
                          key={item.key}
                          class="drag-move"
                          select-item={this.selectItem}
                          // :select-item.sync="selectItem"
                          start-type={this.startType}
                          insert-allowed-type={this.insertAllowedType}
                          record={item}
                          config={this.config}
                          onHandleSelectItem={this.handleSelectItem}
                          onHandleColAdd={this.handleColAdd}
                          onHandleCopy={() => {
                            this.$emit('handleCopy');
                          }}
                          onHandleShowRightMenu={this.handleShowRightMenu}
                          onHandleDetele={() => {
                            this.$emit('handleDetele');
                          }}
                        />
                      );
                    })}
                  </transition-group>
                </draggable>
              </div>
            </a-card>

            <div
              class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'copy')}
              onClick={event => {
                event.stopPropagation();
                this.$emit('handleCopy');
              }}
            >
              <a-icon type="copy" />
            </div>
            <div
              class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'delete')}
              onClick={event => {
                event.stopPropagation();
                this.$emit('handleDetele');
              }}
            >
              <a-icon type="delete" />
            </div>
          </div>
        </div>
      );
      // 卡片布局 end
    } else if (this.record.type === 'table') {
      {
        /* 表格布局 start */
      }
      result = (
        <div
          class={{ active: this.record.key === this.selectItem.key, 'table-box': true }}
          onClick={event => {
            event.stopPropagation();
            this.handleSelectItem(this.record);
          }}
        >
          <table
            class={{
              'table-layout kk-table-9136076486841527': true,
              bright: this.record.options.bright,
              small: this.record.options.small,
              bordered: this.record.options.bordered,
            }}
            style={this.record.options.customStyle}
          >
            {this.record.trs.map((trItem, trIndex) => {
              return (
                <tr key={trIndex}>
                  {trItem.tds.map((tdItem, tdIndex) => {
                    return (
                      <td
                        key={tdIndex}
                        class="table-td"
                        colspan={tdItem.colspan}
                        rowspan={tdItem.rowspan}
                        onContextmenu={event => {
                          event.preventDefault();
                          this.$emit('handleShowRightMenu', event, this.record, trIndex, tdIndex);
                        }}
                      >
                        <draggable
                          value={tdItem.list}
                          onInput={value => {
                            tdItem.list = value;
                          }}
                          tag="div"
                          class="draggable-box"
                          group="form-draggable"
                          ghostClass="moving"
                          animation={180}
                          handle=".drag-move"
                          onStart={event => {
                            this.$emit('dragStart', event, tdItem.list);
                          }}
                          onAdd={event => {
                            this.$emit('handleColAdd', event, tdItem.list);
                          }}
                        >
                          <transition-group tag="div" name="list" class="list-main">
                            {tdItem.list.map(item => {
                              return (
                                <layoutItem
                                  key={item.key}
                                  class="drag-move"
                                  select-item={this.selectItem}
                                  //  :select-item.sync="this.selectItem"
                                  start-type={this.startType}
                                  insert-allowed-type={this.insertAllowedType}
                                  record={item}
                                  config={this.config}
                                  onHandleSelectItem={this.handleSelectItem}
                                  onHandleColAdd={this.handleColAdd}
                                  onHandleCopy={() => {
                                    this.$emit('handleCopy');
                                  }}
                                  onHandleShowRightMenu={this.handleShowRightMenu}
                                  onHandleDetele={() => {
                                    this.$emit('handleDetele');
                                  }}
                                />
                              );
                            })}
                          </transition-group>
                        </draggable>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </table>
          <div
            class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'copy')}
            onClick={event => {
              event.stopPropagation();
              this.$emit('handleCopy');
            }}
          >
            <a-icon type="copy" />
          </div>
          <div
            class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'delete')}
            onClick={event => {
              event.stopPropagation();
              this.$emit('handleDetele');
            }}
          >
            <a-icon type="delete" />
          </div>
        </div>
      );
      // 表格布局 end
    } else {
      result = (
        <div>
          <formNode
            key={this.record.key}
            select-item={this.selectItem}
            // select-item.sync={this.selectItem}
            record={this.record}
            config={this.config}
            onHandleSelectItem={this.handleSelectItem}
            onHandleCopy={() => {
              this.$emit('handleCopy');
            }}
            onHandleDetele={() => {
              this.$emit('handleDetele');
            }}
            onHandleShowRightMenu={() => {
              this.$emit('handleShowRightMenu');
            }}
          />
        </div>
      );
    }
    return (
      <div
        class={{
          'layout-width': ['grid', 'table', 'card', 'divider', 'html'].includes(this.record.type),
        }}
      >
        {result}
      </div>
    );
  },
};
