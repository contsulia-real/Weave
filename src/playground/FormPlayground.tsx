import { useState } from 'react'
import {
  Button,
  Checkbox,
  Column,
  Combobox,
  ComboboxOption,
  Form,
  FormField,
  FormFieldset,
  FormLegend,
  Input,
  Progress,
  Radio,
  RangeSlider,
  Row,
  Select,
  SelectOption,
  Slider,
  Switch,
  Text,
} from '../index'
import { PlaygroundSection } from './PlaygroundSection'

export function FormPlayground() {
  const [progressHigh, setProgressHigh] = useState(false)
  const [sliderValue, setSliderValue] = useState(40)
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75])
  const [formResult, setFormResult] = useState('Not submitted')
  const progress = progressHigh ? 0.82 : 0.28

  return (
    <>
      <PlaygroundSection
        title="Form"
        description="真实 form + FormField 语义关联；浏览器负责原生 constraint validation，Select / Combobox / Switch 通过原生 form proxy 进入 FormData，reset 恢复 uncontrolled 默认值。"
      >
        <Form
          onSubmit={(event) => {
            event.preventDefault()
            setFormResult(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))))
          }}
          onReset={() => setFormResult('Reset')}
          viewProps={{ width: 30, data: { testid: 'form-demo' } }}
        >
          <FormField label="Email" description="Used for account notifications." required>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              viewProps={{ width: 'fill', data: { testid: 'form-email' } }}
            />
          </FormField>

          <FormField
            label="Display name"
            error="This example shows an application error immediately."
          >
            <Input
              name="displayName"
              defaultValue="Weave user"
              viewProps={{ width: 'fill', data: { testid: 'form-display-name' } }}
            />
          </FormField>

          <FormFieldset>
            <FormLegend>Preferences</FormLegend>

            <FormField label="Country">
              <Select
                name="country"
                defaultValue="us"
                viewProps={{ width: 'fill', data: { testid: 'form-country' } }}
              >
                <SelectOption value="us" text="United States" />
                <SelectOption value="ca" text="Canada" />
              </Select>
            </FormField>

            <FormField label="Framework">
              <Combobox
                name="framework"
                defaultValue="react"
                viewProps={{ width: 'fill', data: { testid: 'form-framework' } }}
              >
                <ComboboxOption value="react" text="React" />
                <ComboboxOption value="vue" text="Vue" />
              </Combobox>
            </FormField>

            <FormField label="Notifications">
              <Switch
                name="notifications"
                defaultChecked
                label="Enabled"
                viewProps={{ data: { testid: 'form-notifications' } }}
              />
            </FormField>

            <FormField label="Budget range">
              <RangeSlider
                startName="budgetMin"
                endName="budgetMax"
                startLabel="Minimum budget"
                endLabel="Maximum budget"
                defaultValue={[20, 80]}
                step={10}
              />
            </FormField>
          </FormFieldset>

          <Row gap={0.75} align="center">
            <Button type="submit" text="Submit" />
            <Button type="reset" variant="ghost" text="Reset" />
          </Row>

          <Text typo="body-small" color="secondary" viewProps={{ data: { testid: 'form-result' } }}>
            {formResult}
          </Text>
        </Form>
      </PlaygroundSection>

      <PlaygroundSection
        title="Input"
        description="单行 Input 是 field surface 的视觉来源；默认非空时显示可隐藏 clear action；Select 复用 Input stylesheet/theme，Combobox 直接组合 Input；multiline 仍使用 Input theme 与 Weave Scrollbar。"
      >
        <Column gap={0.75} align="start">
          <Input
            defaultValue="Editable input"
            placeholder="Name"
            autoComplete="name"
            viewProps={{
              width: 20,
            }}
          />

          <Input
            defaultValue="Clear hidden"
            clearable={false}
            viewProps={{
              width: 20,
            }}
          />

          <Input
            disabled
            defaultValue="Disabled input"
            viewProps={{
              width: 20,
              data: { testid: 'input-disabled' },
            }}
          />

          <Input
            multiline
            rows={4}
            defaultValue={[
              'Multiline Input now uses Weave Scrollbar.',
              'Small scroll movements update only the thumb transform.',
              'Geometry is recalculated only on resize or layout changes.',
              'The textarea keeps native editing and scrolling behavior.',
              'Input and Button now share the same control height.',
              'Border, radius and focus treatment come from the theme.',
            ].join('\n')}
            placeholder="Notes"
            viewProps={{
              width: 32,
            }}
          />
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Slider"
        description="M3 的粗双段轨道与 gap，融合 Weave 的圆形 thumb、突起 active surface 和 Switch 同款抓取形变；显式 step 才渲染更清晰的 dot，数值交互仍由原生 range 负责。"
      >
        <Column gap={1.25} align="start">
          <Row gap={1.5} align="center" wrap>
            <Slider
              size="small"
              defaultValue={25}
              label="Small"
              viewProps={{ data: { testid: 'slider-small' } }}
            />
            <Slider
              size="medium"
              defaultValue={50}
              label="Medium"
              viewProps={{ data: { testid: 'slider-medium' } }}
            />
            <Slider
              size="large"
              defaultValue={75}
              label="Large"
              viewProps={{ data: { testid: 'slider-large' } }}
            />
          </Row>

          <Row gap={1.5} align="center" wrap>
            <Slider
              value={sliderValue}
              onChange={setSliderValue}
              step={5}
              label={`Controlled · ${sliderValue}`}
              viewProps={{ data: { testid: 'slider-controlled' } }}
            />

            <Slider
              min={-20}
              max={20}
              step={5}
              defaultValue={5}
              label="Range -20…20 · step 5"
              viewProps={{ data: { testid: 'slider-custom-range' } }}
            />

            <Slider
              disabled
              defaultValue={65}
              label="Disabled"
              viewProps={{ data: { testid: 'slider-disabled' } }}
            />
          </Row>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="RangeSlider"
        description="完整复用 Slider 视觉与 Theme；两个真实 range input 保留原生 drag / keyboard / form 行为，thumb 不穿越，track 点击由最近 thumb 接管，重叠时 start thumb 优先命中。"
      >
        <Column gap={1.25} align="start">
          <Row gap={1.5} align="center" wrap>
            <RangeSlider
              size="small"
              defaultValue={[20, 70]}
              startLabel="Small start"
              endLabel="Small end"
              label="Small"
            />
            <RangeSlider
              size="medium"
              defaultValue={[30, 75]}
              startLabel="Medium start"
              endLabel="Medium end"
              label="Medium"
            />
            <RangeSlider
              size="large"
              defaultValue={[35, 80]}
              startLabel="Large start"
              endLabel="Large end"
              label="Large"
            />
          </Row>

          <Row gap={1.5} align="center" wrap>
            <RangeSlider
              value={rangeValue}
              onChange={setRangeValue}
              step={5}
              startLabel="Controlled start"
              endLabel="Controlled end"
              label={`Controlled · ${rangeValue[0]}–${rangeValue[1]}`}
            />
            <RangeSlider
              defaultValue={[50, 50]}
              step={5}
              startLabel="Overlap start"
              endLabel="Overlap end"
              label="Overlap · start wins pointer hit"
            />
            <RangeSlider
              disabled
              defaultValue={[25, 75]}
              startLabel="Disabled start"
              endLabel="Disabled end"
              label="Disabled"
            />
          </Row>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Switch"
        description="三档语义尺寸；hover 时 thumb 轻微增强，拖动时产生抓取反馈并直接跟手，释放后 spring 归位。"
      >
        <Row gap={1.5} align="center" wrap>
          <Switch size="small" label="Small" viewProps={{ data: { testid: 'switch-small' } }} />

          <Switch
            size="medium"
            defaultChecked
            label="Medium"
            viewProps={{ data: { testid: 'switch-medium' } }}
          />

          <Switch size="large" label="Large" />

          <Switch disabled label="Disabled" viewProps={{ data: { testid: 'switch-disabled' } }} />
        </Row>
      </PlaygroundSection>

      <PlaygroundSection
        title="Radio / Checkbox"
        description="三档尺寸明确展示；group 直接建立原生分组：同 group Radio 互斥，同 group Checkbox 共享组名但仍可独立勾选。"
      >
        <Column gap={1.25}>
          <Column gap={0.625}>
            <Text typo="label-medium">Sizes · checked</Text>

            <Row gap={1.5} align="center" wrap>
              <Row gap={0.5} align="center">
                <Radio size="small" defaultChecked label="Radio" />
                <Checkbox size="small" defaultChecked label="Checkbox" />
                <Text typo="body-medium">Small · 18px</Text>
              </Row>

              <Row gap={0.5} align="center">
                <Radio size="medium" defaultChecked label="Radio" />
                <Checkbox size="medium" defaultChecked label="Checkbox" />
                <Text typo="body-medium">Medium · 22px</Text>
              </Row>

              <Row gap={0.5} align="center">
                <Radio size="large" defaultChecked label="Radio" />
                <Checkbox size="large" defaultChecked label="Checkbox" />
                <Checkbox size="large" indeterminate label="Indeterminate" />
                <Text typo="body-medium">Large · 26px</Text>
              </Row>
            </Row>
          </Column>

          <Row gap={2} align="start" wrap>
            <Column gap={0.625}>
              <Text typo="label-medium">Radio group · theme</Text>

              <Row gap={0.5} align="center">
                <Radio group="theme-demo" value="light" defaultChecked label="Light" />
              </Row>

              <Row gap={0.5} align="center">
                <Radio group="theme-demo" value="dark" label="Dark" />
              </Row>

              <Row gap={0.5} align="center">
                <Radio
                  group="theme-demo"
                  value="system"
                  disabled
                  label="System · disabled"
                  viewProps={{ data: { testid: 'radio-disabled' } }}
                />
              </Row>
            </Column>

            <Column gap={0.625}>
              <Text typo="label-medium">Checkbox group · permissions</Text>

              <Row gap={0.5} align="center">
                <Checkbox group="permissions-demo" value="read" defaultChecked label="Read" />
              </Row>

              <Row gap={0.5} align="center">
                <Checkbox group="permissions-demo" value="write" label="Write" />
              </Row>

              <Row gap={0.5} align="center">
                <Checkbox
                  group="permissions-demo"
                  value="admin"
                  disabled
                  label="Admin · disabled"
                  viewProps={{ data: { testid: 'checkbox-disabled' } }}
                />
              </Row>
            </Column>
          </Row>
        </Column>
      </PlaygroundSection>

      <PlaygroundSection
        title="Progress"
        description="mode 决定 spin / linear；tracked 只控制浅色连续轨道。"
      >
        <Column gap={1}>
          <Row gap={1.5} align="center" wrap>
            <Row gap={0.5} align="center">
              <Progress indeterminate mode="spin" size="medium" color="primary" />
              <Text typo="body-medium">Spin</Text>
            </Row>

            <Row gap={0.5} align="center">
              <Progress indeterminate mode="spin" tracked size="medium" color="primary" />
              <Text typo="body-medium">Spin tracked</Text>
            </Row>

            <Row gap={0.5} align="center">
              <Progress indeterminate mode="linear" size="medium" color="primary" />
              <Text typo="body-medium">Linear</Text>
            </Row>

            <Row gap={0.5} align="center">
              <Progress indeterminate mode="linear" tracked size="medium" color="primary" />
              <Text typo="body-medium">Linear tracked</Text>
            </Row>
          </Row>

          <Row gap={1.5} align="center" wrap>
            <Progress progress={progress} mode="spin" tracked size="large" color="success" />

            <Progress progress={progress} mode="linear" tracked size="large" color="success" />

            <Switch checked={progressHigh} onChange={setProgressHigh} size="small" />

            <Text typo="body-medium">{Math.round(progress * 100)}%</Text>
          </Row>
        </Column>
      </PlaygroundSection>
    </>
  )
}
