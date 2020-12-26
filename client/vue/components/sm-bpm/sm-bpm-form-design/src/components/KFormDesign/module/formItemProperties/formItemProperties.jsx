/*
 * author kcz
 * date 2019-11-20
 * description 表单控件属性设置组件,因为配置数据是引用关系，所以可以直接修改
 */
import KChangeOption from '../../../KChangeOption/index';
import kCheckbox from '../../../KCheckbox/index';
export default {
  name: 'FormItemProperties',
  components: {
    kCheckbox,
    KChangeOption,
  },
  props: {
    selectItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      options: {},
    };
  },
  watch: {
    selectItem(val) {
      this.options = val.options || {};
    },
  },

  render() {
    let placeholder;
    if (typeof this.options.rangePlaceholder !== 'undefined' && this.options.range) {
      placeholder = (
        <a-form-item label="占位内容">
          <a-input
            value={this.options.rangePlaceholder[0]}
            onChange={event => {
              this.options.rangePlaceholder[0] = event.target.value;
            }}
            placeholder="请输入"
          />
          <a-input
            value={this.options.rangePlaceholder[1]}
            onChange={event => {
              this.options.rangePlaceholder[1] = event.target.value;
            }}
            placeholder="请输入"
          />
        </a-form-item>
      );
    } else if (typeof this.options.placeholder !== 'undefined') {
      placeholder = (
        <a-form-item label="占位内容">
          <a-input
            value={this.options.placeholder}
            onInput={event => {
              this.options.placeholder = event.target.value;
            }}
            placeholder="请输入"
          />
        </a-form-item>
      );
    }
    return (
      <div class="properties-centent kk-checkbox">
        {/* <div class="head-title">控件属性设置</div> */}
        <div class="properties-body">
          {this.selectItem.key === '' ? <span style="color:#ccc">未选择控件</span> : undefined}
          {this.selectItem.key !== '' ? (
            <a-form>
              {typeof this.selectItem.label !== 'undefined' ? (
                <a-form-item label="标签">
                  <a-input
                    value={this.selectItem.label}
                    onInput={event => {
                      this.selectItem.label = event.target.value;
                    }}
                    placeholder="请输入"
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {typeof this.selectItem.model !== 'undefined' ? (
                <a-form-item label="数据字段">
                  <a-input
                    value={this.selectItem.model}
                    onInput={event => {
                      this.selectItem.model = event.target.value;
                    }}
                    placeholder="请输入"
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* input type start */}
              {this.selectItem.type === 'input' ? (
                <a-form-item label="输入框type">
                  <a-input
                    value={this.options.type}
                    onInput={event => {
                      this.options.type = event.target.value;
                    }}
                    placeholder="请输入"
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {/* input type end  */}
              {placeholder}
              {this.selectItem.type === 'textarea' ? (
                <a-form-item label="自适应内容高度">
                  <a-input-number
                    value={this.options.minRows}
                    onChange={value => {
                      this.options.minRows = value;
                    }}
                    style="width:100%"
                    placeholder="最小高度"
                  />
                  <a-input-number
                    value={this.options.maxRows}
                    onChange={value => {
                      this.options.maxRows = value;
                    }}
                    style="width:100%"
                    placeholder="最大高度"
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {typeof this.options.width !== 'undefined' ? (
                <a-form-item label="宽度">
                  <a-input
                    value={this.options.width}
                    onInput={event => {
                      this.options.width = event.target.value;
                    }}
                    placeholder="请输入"
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {typeof this.options.height !== 'undefined' ? (
                <a-form-item label="高度">
                  <a-input-number
                    value={this.options.height}
                    onChange={value => {
                      this.options.height = value;
                    }}
                    v-model=""
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {typeof this.options.step !== 'undefined' ? (
                <a-form-item label="步长">
                  <a-input-number
                    value={this.options.step}
                    onChange={value => {
                      this.options.step = value;
                    }}
                    placeholder="请输入"
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {typeof this.options.min !== 'undefined' ? (
                <a-form-item label="最小值">
                  <a-input-number
                    value={this.options.min}
                    onChange={value => {
                      this.options.min = value;
                    }}
                    placeholder="请输入"
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {typeof this.options.max !== 'undefined' ? (
                <a-form-item label="最大值">
                  <a-input-number
                    value={this.options.max}
                    onChange={value => {
                      this.options.max = value;
                    }}
                    placeholder="请输入"
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {typeof this.options.dictCode !== 'undefined' ? (
                <a-form-item label="dictCode">
                  <a-input
                    value={this.options.dictCode}
                    onInput={event => {
                      this.options.dictCode = event.target.value;
                    }}
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* 选项配置及动态数据配置 start  */}
              {typeof this.options.options !== 'undefined' ? (
                <a-form-item label="选项配置">
                  <a-radio-group
                    value={this.options.dynamic}
                    onChange={event => {
                      this.options.dynamic = event.target.value;
                    }}
                    button-style="solid"
                  >
                    <a-radio-button value={false}>静态数据</a-radio-button>
                    <a-radio-button value={true}>动态数据</a-radio-button>
                  </a-radio-group>
                  {this.options.dynamic ? (
                    <a-input
                      value={this.options.dynamicKey}
                      onInput={event => {
                        this.options.dynamicKey = event.target.value;
                      }}
                      placeholder="动态数据变量名"
                    />
                  ) : (
                    <KChangeOption
                      value={this.options.options}
                      onInput={value => {
                        this.options.options = value;
                      }}
                    />
                  )}
                </a-form-item>
              ) : (
                undefined
              )}

              {/* 选项配置及动态数据配置 end  */}
              {this.selectItem.type === 'grid' ? (
                <div>
                  <a-form-item label="栅格间距">
                    <a-input-number
                      value={this.selectItem.options.gutter}
                      onChange={value => {
                        this.selectItem.options.gutter = value;
                      }}
                      placeholder="请输入"
                    />
                  </a-form-item>
                  <a-form-item label="列配置项">
                    <KChangeOption
                      value={this.selectItem.columns}
                      onInput={value => {
                        this.selectItem.columns = value;
                      }}
                      type="colspan"
                    />
                  </a-form-item>
                </div>
              ) : (
                undefined
              )}

              {this.selectItem.type === 'switch' ? (
                <a-form-item label="默认值">
                  <a-switch
                    checked={this.options.defaultValue}
                    onChange={checked => {
                      this.options.defaultValue = checked;
                    }}
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {['number', 'slider'].indexOf(this.selectItem.type) >= 0 ? (
                <a-form-item label="默认值">
                  <a-input-number
                    value={this.options.defaultValue}
                    onChange={value => {
                      this.options.defaultValue = value;
                    }}
                    step={this.options.step}
                    max={this.options.max}
                    min={this.options.min}
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {this.selectItem.type === 'rate' ? (
                <a-form-item label="默认值">
                  <a-rate
                    value={this.options.defaultValue}
                    onInput={value => {
                      this.options.defaultValue = value;
                    }}
                    allow-half={this.options.allowHalf}
                    count={this.options.max}
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {this.selectItem.type === 'select' ? (
                <a-form-item label="默认值">
                  <a-select
                    value={this.options.defaultValue}
                    onChange={value => {
                      this.options.defaultValue = value;
                    }}
                    v-model=""
                    options={this.options.options}
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {this.selectItem.type === 'radio' ? (
                <a-form-item label="默认值">
                  <a-radio-group
                    value={this.options.defaultValue}
                    onChange={event => {
                      this.options.defaultValue = event.target.value;
                    }}
                    options={this.options.options}
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {this.selectItem.type === 'checkbox' ? (
                <a-form-item label="默认值">
                  <a-checkbox-group
                    value={this.options.defaultValue}
                    onChange={checkedValue => {
                      this.options.defaultValue = checkedValue;
                    }}
                    options={this.options.options}
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* 日期选择器默认值 start  */}
              {this.selectItem.type === 'date' ? (
                <a-form-item label="默认值">
                  {!this.options.range ? (
                    <a-input
                      value={this.options.defaultValue}
                      onInput={event => {
                        this.options.defaultValue = event.target.value;
                      }}
                      placeholder={
                        typeof this.options.format === 'undefined' ? '' : this.options.format
                      }
                    />
                  ) : (
                    <div>
                      <a-input
                        value={this.options.rangeDefaultValue[0]}
                        onInput={event => {
                          this.options.rangeDefaultValue[0] = event.target.value;
                        }}
                        placeholder={
                          typeof this.options.format === 'undefined' ? '' : this.options.format
                        }
                      />
                      <a-input
                        value={this.options.rangeDefaultValue[1]}
                        onInput={event => {
                          this.options.rangeDefaultValue[1] = event.target.value;
                        }}
                        placeholder={
                          typeof this.options.format === 'undefined' ? '' : this.options.format
                        }
                      />
                    </div>
                  )}
                </a-form-item>
              ) : (
                undefined
              )}
              {/* 日期选择器默认值 end */}

              {![
                'number',
                'radio',
                'checkbox',
                'date',
                'rate',
                'select',
                'switch',
                'slider',
                'html',
              ].includes(this.selectItem.type) &&
              typeof this.options.defaultValue !== 'undefined' ? (
                <a-form-item label="默认值">
                  <a-input
                    value={this.options.defaultValue}
                    onInput={event => {
                      this.options.defaultValue = event.target.value;
                    }}
                    v-model="options.defaultValue"
                    placeholder={
                      typeof this.options.format === 'undefined' ? '请输入' : this.options.format
                    }
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* 修改html */}
              {this.selectItem.type === 'html' ? (
                <a-form-item label="默认值">
                  <a-textarea
                    value={this.options.defaultValue}
                    onChange={event => {
                      this.options.defaultValue = event.target.value;
                    }}
                    auto-size={{ minRows: 4, maxRows: 8 }}
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {typeof this.options.format !== 'undefined' ? (
                <a-form-item label="时间格式">
                  <a-input
                    value={this.options.format}
                    onInput={event => {
                      this.options.format = event.target.value;
                    }}
                    placeholder="时间格式如：YYYY-MM-DD HH:mm:ss"
                  />
                </a-form-item>
              ) : (
                undefined
              )}
              {typeof this.options.orientation !== 'undefined' ? (
                <a-form-item label="标签位置">
                  <a-radio-group
                    value={this.options.orientation}
                    onChange={event => {
                      this.options.orientation = event.target.value;
                    }}
                    button-style="solid"
                  >
                    <a-radio-button value="left">左</a-radio-button>
                    <a-radio-button value="">居中</a-radio-button>
                    <a-radio-button value="right">右</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              ) : (
                undefined
              )}

              {this.selectItem.type === 'button' ? (
                <div>
                  <a-form-item label="类型">
                    <a-radio-group
                      value={this.options.type}
                      onChange={event => {
                        this.options.type = event.target.value;
                      }}
                      button-style="solid"
                    >
                      <a-radio value="primary">Primary</a-radio>
                      <a-radio value="default">Default</a-radio>
                      <a-radio value="dashed">Dashed</a-radio>
                      <a-radio value="danger">Danger</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="按钮操作">
                    <a-radio-group
                      value={this.options.handle}
                      onChange={event => {
                        this.options.handle = event.target.value;
                      }}
                      button-style="solid"
                    >
                      <a-radio-button value="submit">提交</a-radio-button>
                      <a-radio-button value="reset">重置</a-radio-button>
                      <a-radio-button value="dynamic">动态函数</a-radio-button>
                    </a-radio-group>
                    {this.options.handle === 'dynamic' ? (
                      <a-input
                        value={this.ooptions.dynamicFun}
                        onInput={event => {
                          this.options.dynamicFun = event.target.value;
                        }}
                        placeholder="动态函数名"
                      />
                    ) : (
                      undefined
                    )}
                  </a-form-item>
                </div>
              ) : (
                undefined
              )}
              {/* 警告提示 */}
              {this.selectItem.type === 'alert' ? (
                <div>
                  <a-form-item label="辅助描述">
                    <a-input
                      value={this.options.description}
                      onInput={event => {
                        this.options.description = event.target.value;
                      }}
                    />
                  </a-form-item>
                  <a-form-item label="类型">
                    <a-radio-group
                      value={this.options.type}
                      onChange={event => {
                        this.options.type = event.target.value;
                      }}
                      button-style="solid"
                    >
                      <a-radio value="success">success</a-radio>
                      <a-radio value="info">info</a-radio>
                      <a-radio value="warning">warning</a-radio>
                      <a-radio value="error">error</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="操作属性">
                    <kCheckbox
                      value={this.options.showIcon}
                      onInput={value => {
                        this.options.showIcon = value;
                      }}
                      label="显示图标"
                    />
                    <kCheckbox
                      value={this.options.banner}
                      onInput={value => {
                        this.options.banner = value;
                      }}
                      label="无边框"
                    />
                    <kCheckbox
                      value={this.options.closable}
                      onInput={value => {
                        this.options.closable = value;
                      }}
                      label="可关闭"
                    />
                  </a-form-item>
                </div>
              ) : (
                undefined
              )}

              {/* 上传图片 */}
              {/* {this.selectItem.type === 'uploadImg' ? (
                <a-form-item label="样式">
                  <a-radio-group
                    value={this.options.listType}
                    onChange={event => {
                      this.options.listType = event.target.value;
                    }}
                    button-style="solid"
                  >
                    <a-radio-button value="text">text</a-radio-button>
                    <a-radio-button value="picture">picture</a-radio-button>
                    <a-radio-button value="picture-card">card</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              ) : (
                undefined
              )} */}

              {/* 上传数量 */}
              {typeof this.options.limit !== 'undefined' ? (
                <a-form-item label="最大上传数量">
                  <a-input-number
                    value={this.options.limit}
                    onChange={value => {
                      this.options.limit = value;
                    }}
                    min={1}
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* scrollY */}
              {typeof this.options.scrollY !== 'undefined' ? (
                <a-form-item label="scrollY">
                  <a-input-number
                    value={this.options.scrollY}
                    onChange={value => {
                      this.options.scrollY = value;
                    }}
                    min={0}
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* 上传地址 */}
              {typeof this.options.action !== 'undefined' ? (
                <a-form-item label="上传地址">
                  <a-input
                    value={this.options.action}
                    onInput={event => {
                      this.options.action = event.target.value;
                    }}
                    placeholder="请输入"
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* 上传额外参数  */}
              {typeof this.options.data !== 'undefined' ? (
                <a-form-item label="额外参数（JSON格式）">
                  <a-input
                    value={this.options.data}
                    onInput={event => {
                      this.options.data = event.target.value;
                    }}
                    placeholder="严格JSON格式"
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* 文字对齐方式  */}
              {this.selectItem.type === 'text' ? (
                <template>
                  <a-form-item label="文字对齐方式">
                    <a-radio-group
                      value={this.options.textAlign}
                      onChange={value => {
                        this.options.textAlign = value;
                      }}
                      button-style="solid"
                    >
                      <a-radio-button value="left">左</a-radio-button>
                      <a-radio-button value="center">居中</a-radio-button>
                      <a-radio-button value="right">右</a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="操作属性">
                    <kCheckbox
                      value={this.options.showRequiredMark}
                      onInput={value => {
                        this.options.showRequiredMark = value;
                      }}
                      label="显示必选标记"
                    />
                  </a-form-item>
                </template>
              ) : (
                undefined
              )}
              {typeof this.options.disabled !== 'undefined' ||
              typeof this.options.readonly !== 'undefined' ||
              typeof this.options.clearable !== 'undefined' ||
              typeof this.options.multiple !== 'undefined' ||
              typeof this.options.range !== 'undefined' ||
              typeof this.options.showTime !== 'undefined' ||
              typeof this.options.allowHalf !== 'undefined' ||
              typeof this.options.showInput !== 'undefined' ? (
                <a-form-item label="操作属性">
                  {typeof this.options.disabled !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.disabled}
                      onInput={value => {
                        this.options.disabled = value;
                      }}
                      label="禁用"
                    />
                  ) : (
                    undefined
                  )}

                  {typeof this.options.readonly !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.readonly}
                      onInput={value => {
                        this.options.readonly = value;
                      }}
                      label="只读"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.clearable !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.clearable}
                      onInput={value => {
                        this.options.clearable = value;
                      }}
                      label="可清除"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.multiple !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.multiple}
                      onInput={value => {
                        this.options.multiple = value;
                      }}
                      label="多选"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.range !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.range}
                      onInput={value => {
                        this.options.range = value;
                      }}
                      label="范围选择"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.showTime !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.showTime}
                      onInput={value => {
                        this.options.showTime = value;
                      }}
                      label="时间选择器"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.allowHalf !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.allowHalf}
                      onInput={value => {
                        this.options.allowHalf = value;
                      }}
                      label="允许半选"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.showInput !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.showInput}
                      onInput={value => {
                        this.options.showInput = value;
                      }}
                      label="显示输入框"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.showLabel !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.showLabel}
                      onInput={value => {
                        this.options.showLabel = value;
                      }}
                      label="显示Label"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.chinesization !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.chinesization}
                      onInput={value => {
                        this.options.chinesization = value;
                      }}
                      label="汉化"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.hideSequence !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.hideSequence}
                      onInput={value => {
                        this.options.hideSequence = value;
                      }}
                      label="隐藏序号"
                    />
                  ) : (
                    undefined
                  )}
                  {typeof this.options.drag !== 'undefined' ? (
                    <kCheckbox
                      value={this.options.drag}
                      onInput={value => {
                        this.options.drag = value;
                      }}
                      label="允许拖拽"
                    />
                  ) : (
                    undefined
                  )}
                </a-form-item>
              ) : (
                undefined
              )}

              {typeof this.selectItem.rules !== 'undefined' && this.selectItem.rules.length > 0 ? (
                <a-form-item label="校验">
                  <kCheckbox
                    value={this.selectItem.rules[0].required}
                    onInput={value => {
                      this.selectItem.rules[0].required = value;
                    }}
                    label="必填"
                  />
                  <a-input
                    value={this.selectItem.rules[0].message}
                    onInput={event => {
                      this.selectItem.rules[0].message = event.target.value;
                    }}
                    placeholder="必填校验提示信息"
                  />
                  <KChangeOption
                    value={this.selectItem.rules}
                    onInput={value => {
                      this.selectItem.rules = value;
                    }}
                    type="rules"
                  />
                </a-form-item>
              ) : (
                undefined
              )}

              {/* 表格选项  */}
              {this.selectItem.type === 'table' ? (
                <div>
                  <a-form-item label="表格样式CSS">
                    <a-input
                      value={this.selectItem.options.customStyle}
                      onInput={event => {
                        this.selectItem.options.customStyle = event.target.value;
                      }}
                    />
                  </a-form-item>
                  <a-form-item label="属性">
                    <kCheckbox
                      value={this.selectItem.options.bordered}
                      onInput={value => {
                        this.selectItem.options.bordered = value;
                      }}
                      label="显示边框"
                    />
                    <kCheckbox
                      value={this.selectItem.options.bright}
                      onInput={value => {
                        this.selectItem.options.bright = value;
                      }}
                      label="鼠标经过点亮"
                    />
                    <kCheckbox
                      value={this.selectItem.options.small}
                      onInput={value => {
                        this.selectItem.options.small = value;
                      }}
                      label="紧凑型"
                    />
                  </a-form-item>

                  <a-form-item label="提示">
                    <p style="line-height: 26px;">请点击右键增加行列，或者合并单元格</p>
                  </a-form-item>
                </div>
              ) : (
                undefined
              )}
            </a-form>
          ) : (
            undefined
          )}
        </div>
        {/* <div
          class="close-box"
          onClick={() => {
            this.$emit('handleHide');
          }}
        >
          <a-icon type="double-right" />
        </div> */}
      </div>
    );
  },
};
