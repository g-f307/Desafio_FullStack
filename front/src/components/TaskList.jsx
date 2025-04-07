import { Card, Badge, ButtonGroup, Button, Stack } from 'react-bootstrap';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Concluída': return 'success';
      case 'Em Andamento': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <Card key={task.id} className="mb-3 shadow-sm task-card">
          <Card.Body>
            <Stack direction="horizontal" gap={3} className="mb-2">
              <Card.Title className="mb-0">{task.title}</Card.Title>
              <Badge bg={getStatusVariant(task.status)} className="ms-auto">
                {task.status}
              </Badge>
            </Stack>
            
            <Card.Text className="text-muted">{task.description}</Card.Text>
            
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Criado em: {new Date(task.created_at).toLocaleDateString('pt-BR')}
              </small>
              
              <ButtonGroup>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  Editar
                </Button>
                
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="ms-2"
                >
                  Excluir
                </Button>
                
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task, e.target.value)}
                  className="form-select ms-2"
                  style={{ width: 'auto' }}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </ButtonGroup>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;