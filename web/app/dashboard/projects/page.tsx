'use client';
import { useState } from 'react';
import { useProjects, useUpdateTask, useCreateProject } from '@/hooks/useQueries';
import { Card, Modal, Skeleton, EmptyState } from '@/components/ui';
import { cn, getPriorityColor } from '@/lib/utils';
import { Plus, FolderKanban, Calendar, Users, AlertCircle, Clock, CheckCircle2, Eye } from 'lucide-react';
import { format } from 'date-fns';

const COLUMNS = [
  { id: 'todo', label: 'To Do', icon: <Clock size={13} />, color: 'text-gray-500', dot: 'bg-gray-400' },
  { id: 'in_progress', label: 'In Progress', icon: <AlertCircle size={13} />, color: 'text-amber-500', dot: 'bg-amber-400' },
  { id: 'review', label: 'In Review', icon: <Eye size={13} />, color: 'text-sky-500', dot: 'bg-sky-400' },
  { id: 'done', label: 'Done', icon: <CheckCircle2 size={13} />, color: 'text-emerald-500', dot: 'bg-emerald-400' },
];

const PRIORITY_LABELS = { low: 'Low', medium: 'Med', high: 'High', urgent: 'Urgent' };

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const updateTask = useUpdateTask();
  const createProject = useCreateProject();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', color: '#6366f1' });

  const project = selectedProject || projects[0];

  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = (project?.tasks || []).filter((t: any) => t.status === col.id);
    return acc;
  }, {} as Record<string, any[]>);

  const handleStatusChange = async (projectId: string, taskId: string, newStatus: string) => {
    await updateTask.mutateAsync({ projectId, taskId, status: newStatus });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track tasks and project progress.</p>
        </div>
        <button onClick={() => setNewProjectModal(true)} className="btn-primary flex items-center gap-2 text-xs sm:text-sm">
          <Plus size={14} /> <span className="hidden sm:inline">New Project</span><span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Project Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {projects.map((p: any) => (
            <button
              key={p._id}
              onClick={() => setSelectedProject(p)}
              className={cn('card p-3 sm:p-4 text-left hover:shadow-md transition-all duration-200 cursor-pointer', project?._id === p._id ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-gray-950' : '')}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ background: p.color + '20' }}>
                  <FolderKanban size={14} style={{ color: p.color }} />
                </div>
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium hidden sm:inline', p.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400')}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">{p.name}</p>
              <p className="text-xs text-gray-400 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">{p.description}</p>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
              </div>
              <p className="text-xs text-gray-400">{p.progress}% · {p.tasks?.length || 0} tasks</p>
            </button>
          ))}
        </div>
      )}

      {/* Kanban Board */}
      {project && (
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{project.name}</h2>
            {project.dueDate && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={11} /> {format(new Date(project.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            {project.team?.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Users size={11} /> {project.team.length} members
              </span>
            )}
          </div>

          {/* Kanban columns - horizontal scroll on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 xl:grid-cols-4 sm:overflow-visible">
            {COLUMNS.map(col => (
              <div key={col.id} className="min-w-[220px] sm:min-w-0 space-y-2">
                <div className="flex items-center gap-2 px-1 mb-2 sm:mb-3">
                  <span className={cn(col.color)}>{col.icon}</span>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{col.label}</span>
                  <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {tasksByStatus[col.id]?.length || 0}
                  </span>
                </div>

                <div className="space-y-2 min-h-[80px]">
                  {tasksByStatus[col.id]?.map((task: any) => (
                    <div key={task._id} className="card p-2.5 sm:p-3 hover:shadow-sm transition-shadow cursor-pointer group">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-snug">{task.title}</p>
                        <span className={cn('text-xs font-semibold shrink-0', getPriorityColor(task.priority))}>
                          {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]}
                        </span>
                      </div>
                      {task.assignee && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-[9px] font-bold text-brand-700 dark:text-brand-400">
                            {task.assignee[0]}
                          </div>
                          <span className="text-xs text-gray-400 truncate">{task.assignee}</span>
                        </div>
                      )}
                      <select
                        className="w-full text-[10px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded px-1.5 py-1 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        value={task.status}
                        onChange={(e) => handleStatusChange(project._id, task._id, e.target.value)}
                      >
                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                  ))}
                  {tasksByStatus[col.id]?.length === 0 && (
                    <div className="border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl h-16 flex items-center justify-center">
                      <p className="text-xs text-gray-300 dark:text-gray-700">Empty</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!project && !isLoading && (
        <Card>
          <EmptyState title="No projects yet" description="Create your first project to get started" icon={<FolderKanban size={40} />} />
        </Card>
      )}

      {/* New Project Modal */}
      <Modal open={newProjectModal} onClose={() => setNewProjectModal(false)} title="New Project">
        <form onSubmit={async (e) => {
          e.preventDefault();
          await createProject.mutateAsync(projectForm);
          setNewProjectModal(false);
          setProjectForm({ name: '', description: '', color: '#6366f1' });
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project Name *</label>
            <input required className="input" placeholder="Website Redesign" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea rows={3} className="input resize-none" placeholder="Brief project description..." value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Color</label>
            <div className="flex gap-2 flex-wrap">
              {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444'].map(c => (
                <button key={c} type="button" onClick={() => setProjectForm({ ...projectForm, color: c })}
                  className={cn('w-7 h-7 rounded-full border-2 transition-transform hover:scale-110', projectForm.color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent')}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setNewProjectModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}