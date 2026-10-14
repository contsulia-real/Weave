import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Avatar,
  Button,
  Calendar,
  Card,
  Checkbox,
  Chip,
  Column,
  Progress,
  Row,
  SegmentedButton,
  Slider,
  Stepper,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from '../index'

export function ProjectOverview() {
  const { t } = useTranslation('website')
  const releaseTasks = [
    t('Finalize interactions'),
    t('Review accessibility'),
    t('Prepare release notes'),
  ]
  const [completed, setCompleted] = useState([true, false, false])
  const count = completed.filter(Boolean).length

  return (
    <Card viewProps={{ width: 'fill', padding: 24 }}>
      <Column width="fill" gap={16}>
        <Row width="fill" align="center" justify="space-between" gap={8} wrap>
          <Column gap={4}>
            <Text typo="title-medium">{t('Atlas workspace')}</Text>
            <Text typo="body-small" color="secondary">
              {t('Release checklist')}
            </Text>
          </Column>
          <Chip text={count === releaseTasks.length ? t('Ready') : t('In progress')} />
        </Row>
        <Row align="center" justify="space-between" gap={8}>
          <Text typo="body-small">{t('Sprint progress')}</Text>
          <Text typo="body-small" color="secondary">
            {t('{{count}} of {{total}}', { count, total: releaseTasks.length })}
          </Text>
        </Row>
        <Progress mode="linear" tracked progress={count / releaseTasks.length} />
        <Column gap={12}>
          {releaseTasks.map((task, index) => (
            <Checkbox
              key={task}
              label={task}
              checked={completed[index]}
              onChange={(value) =>
                setCompleted((old) => old.map((item, i) => (i === index ? value : item)))
              }
              size="small"
            />
          ))}
        </Column>
        <Row align="center" gap={8}>
          <Avatar name="Maya Chen" fallback="MC" viewProps={{ width: 32, height: 32 }} />
          <Avatar name="Alex Rivera" fallback="AR" viewProps={{ width: 32, height: 32 }} />
          <Text color="secondary" typo="body-small">
            {t('Design + engineering')}
          </Text>
        </Row>
      </Column>
    </Card>
  )
}

export function TeamCalendar() {
  const { t } = useTranslation('website')
  const [date, setDate] = useState('2026-10-15')
  const agenda =
    date === '2026-10-15'
      ? [`10:00 · ${t('Design review')}`, `14:30 · ${t('Component QA')}`]
      : date === '2026-10-20'
        ? [`11:00 · ${t('Release planning')}`, `15:00 · ${t('Sprint review')}`]
        : []

  return (
    <Card viewProps={{ width: 'fill', padding: 24 }}>
      <Column gap={16} width="fill">
        <Row align="center" justify="space-between" gap={8} wrap>
          <Text typo="title-medium">{t('Team calendar')}</Text>
          <Chip text={t('October 2026')} />
        </Row>
        <Calendar value={date} onChange={setDate} min="2026-10-01" max="2026-10-31" />
        <Column gap={8}>
          <Text typo="label-large">{t('Agenda · {{date}}', { date })}</Text>
          {agenda.length ? (
            agenda.map((item) => (
              <Text key={item} typo="body-small">
                {item}
              </Text>
            ))
          ) : (
            <Text typo="body-small" color="secondary">
              {t('Nothing scheduled. Enjoy the focus time.')}
            </Text>
          )}
        </Column>
      </Column>
    </Card>
  )
}

export function LaunchFlow() {
  const { t } = useTranslation('website')
  const launchSteps = [{ label: t('Design') }, { label: t('Quality') }, { label: t('Launch') }]
  const [step, setStep] = useState(1)
  const descriptions = [
    t('Review screens and approve the visual system.'),
    t('Run accessibility and interaction checks.'),
    t('Everything is ready for the release.'),
  ]

  return (
    <Card viewProps={{ width: 'fill', padding: 24 }}>
      <Column gap={16} width="fill">
        <Text typo="title-medium">{t('Launch workflow')}</Text>
        <Stepper
          steps={launchSteps}
          step={step}
          onStepChange={setStep}
          label={t('Launch stages')}
        />
        <Text typo="body-small" color="secondary">
          {descriptions[step - 1]}
        </Text>
        {step === 3 ? (
          <Alert
            variant="success"
            title={t('Ready to ship')}
            description={t('All preview stages are complete.')}
          />
        ) : (
          <Button
            text={t('Continue')}
            variant="secondary"
            viewProps={{ onClick: () => setStep((s) => Math.min(3, s + 1)) }}
          />
        )}
      </Column>
    </Card>
  )
}

export function TeamInbox() {
  const { t } = useTranslation('website')
  const inboxMessages = [
    {
      name: 'Morgan Lee',
      initials: 'ML',
      subject: t('Component review'),
      note: t('Left a few notes on the new layout.'),
    },
    {
      name: 'Taylor Kim',
      initials: 'TK',
      subject: t('Ready for preview'),
      note: t('The latest build looks good.'),
    },
    {
      name: 'Jordan Park',
      initials: 'JP',
      subject: t('Design system update'),
      note: t('Tokens are synced across the project.'),
    },
  ]
  const [read, setRead] = useState([false, false, true])
  const unread = read.filter((item) => !item).length

  return (
    <Card viewProps={{ width: 'fill', padding: 24 }}>
      <Column gap={16} width="fill">
        <Row align="center" justify="space-between" gap={8} wrap>
          <Text typo="title-medium">{t('Team inbox')}</Text>
          <Chip
            text={unread === 0 ? t('All caught up') : t('{{count}} unread', { count: unread })}
          />
        </Row>
        <Tabs defaultValue="all">
          <TabList>
            <Tab value="all">{t('All')}</Tab>
            <Tab value="unread">{t('Unread')}</Tab>
          </TabList>
          {(['all', 'unread'] as const).map((filter) => (
            <TabPanel key={filter} value={filter}>
              <Column gap={16} paddingTop={16}>
                {inboxMessages
                  .map((message, index) => ({ ...message, index }))
                  .filter(({ index }) => filter === 'all' || !read[index])
                  .map(({ name, initials, subject, note, index }) => (
                    <Row key={name} align="start" gap={12}>
                      <Avatar
                        name={name}
                        fallback={initials}
                        viewProps={{ width: 36, height: 36 }}
                      />
                      <Column grow={1} minWidth={0} gap={4}>
                        <Row align="center" gap={8} wrap>
                          <Text typo="label-medium">{name}</Text>
                          {!read[index] ? <Chip size="small" text={t('New')} /> : null}
                        </Row>
                        <Text typo="body-small">{subject}</Text>
                        <Text typo="body-small" color="secondary">
                          {note}
                        </Text>
                      </Column>
                    </Row>
                  ))}
                {filter === 'unread' && unread === 0 ? (
                  <Text typo="body-small" color="secondary">
                    {t('No unread messages.')}
                  </Text>
                ) : null}
              </Column>
            </TabPanel>
          ))}
        </Tabs>
        <Button
          text={t('Mark all as read')}
          variant="secondary"
          disabled={unread === 0}
          viewProps={{ onClick: () => setRead((old) => old.map(() => true)) }}
        />
      </Column>
    </Card>
  )
}

export function StudioInsights() {
  const { t } = useTranslation('website')
  const [period, setPeriod] = useState<string | null>('week')
  const [goal, setGoal] = useState(80)
  const activity = period === 'month' ? 92 : 64
  const reviews = period === 'month' ? 42 : 16

  return (
    <Card viewProps={{ width: 'fill', padding: 24 }}>
      <Column gap={16} width="fill">
        <Row align="center" justify="space-between" gap={8} wrap>
          <Text typo="title-medium">{t('Studio insights')}</Text>
          <Chip text={t('Sample data')} />
        </Row>
        <SegmentedButton
          selection="single"
          variant="secondary"
          selected={period}
          onSelect={(next) => setPeriod(next ?? 'week')}
          items={[
            { id: 'week', children: t('Week') },
            { id: 'month', children: t('Month') },
          ]}
        />
        <Row align="center" justify="space-between">
          <Column gap={4}>
            <Text typo="body-small" color="secondary">
              {t('Activity')}
            </Text>
            <Text typo="headline-medium">{activity}%</Text>
          </Column>
          <Column gap={4}>
            <Text typo="body-small" color="secondary">
              {t('Reviews')}
            </Text>
            <Text typo="headline-medium">{reviews}</Text>
          </Column>
        </Row>
        <Progress mode="linear" tracked progress={activity / 100} />
        <Row align="center" justify="space-between">
          <Text typo="body-small">{t('Activity goal')}</Text>
          <Text typo="body-small" color="secondary">
            {goal}%
          </Text>
        </Row>
        <Slider
          value={goal}
          onChange={setGoal}
          min={0}
          max={100}
          step={5}
          viewProps={{ label: t('Activity goal'), width: 'fill' }}
        />
        <Text typo="body-small" color="secondary">
          {activity >= goal
            ? t('Goal reached for this period.')
            : t('{{remaining}}% to reach your goal.', { remaining: goal - activity })}
        </Text>
      </Column>
    </Card>
  )
}

export function WorkspacePreferences() {
  const { t } = useTranslation('website')
  const [digest, setDigest] = useState(true)
  const [focus, setFocus] = useState(false)
  const [volume, setVolume] = useState(40)

  return (
    <Card viewProps={{ width: 'fill', padding: 24 }}>
      <Column gap={16} width="fill">
        <Row align="center" justify="space-between" gap={8} wrap>
          <Text typo="title-medium">{t('Workspace preferences')}</Text>
          <Chip text={t('Live preview')} />
        </Row>
        <Switch label={t('Daily digest')} checked={digest} onChange={setDigest} size="small" />
        <Switch label={t('Focus mode')} checked={focus} onChange={setFocus} size="small" />
        <Row align="center" justify="space-between">
          <Text typo="body-small">{t('Volume')}</Text>
          <Text typo="body-small" color="secondary">
            {volume}%
          </Text>
        </Row>
        <Slider
          value={volume}
          onChange={setVolume}
          step={10}
          viewProps={{ label: t('Notification volume'), width: 'fill' }}
        />
        <Text typo="body-small" color="secondary">
          {focus ? `${t('Focus mode is on.')} ` : `${t('Focus mode is off.')} `}
          {digest ? t('Daily summaries enabled.') : t('Daily summaries paused.')}
        </Text>
      </Column>
    </Card>
  )
}
