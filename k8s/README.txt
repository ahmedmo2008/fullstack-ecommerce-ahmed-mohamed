Task 2.3 — Multi-Cloud Namespace Simulation
Student ID: EYOUTH-30811200108992

FILES
namespaces.yaml            creates aws-simulation and gcp-simulation
aws-simulation/app.yaml    frontend + backend pod/service in aws-simulation
gcp-simulation/app.yaml    frontend + backend pod/service in gcp-simulation

REQUIRES: a local Kubernetes cluster (Docker Desktop Kubernetes, minikube, or kind) and kubectl pointed at it.

1. Create the namespaces
   kubectl apply -f namespaces.yaml

2. Deploy into each namespace
   kubectl apply -f aws-simulation/app.yaml
   kubectl apply -f gcp-simulation/app.yaml

3. Confirm pods are running
   kubectl get pods -n aws-simulation
   kubectl get pods -n gcp-simulation

4. Reach the services with port-forward (run each in its own terminal, or one at a time)
   kubectl port-forward -n aws-simulation svc/frontend-service 8081:80
   kubectl port-forward -n aws-simulation svc/backend-service  8082:5678
   kubectl port-forward -n gcp-simulation svc/frontend-service 8083:80
   kubectl port-forward -n gcp-simulation svc/backend-service  8084:5678

   Then in another terminal:
   curl http://localhost:8081        (nginx welcome page)
   curl http://localhost:8082        ("aws-simulation backend up")
   curl http://localhost:8083        (nginx welcome page)
   curl http://localhost:8084        ("gcp-simulation backend up")

5. Verify isolation (resources in one namespace are not visible from the other)
   kubectl get pods -n aws-simulation --no-headers | wc -l   -> should NOT list gcp-simulation's pods
   kubectl get svc backend-service -n gcp-simulation         -> works
   kubectl get svc backend-service -n aws-simulation         -> a DIFFERENT object, not the same resource
   kubectl get pod frontend -n aws-simulation -o jsonpath='{.metadata.uid}'
   kubectl get pod frontend -n gcp-simulation -o jsonpath='{.metadata.uid}'
   -> the two UIDs are different, confirming they are separate resources scoped to their own namespace.
   Attempting to describe a gcp-simulation pod while targeting aws-simulation fails:
   kubectl describe pod frontend -n aws-simulation | grep -i gcp   -> no match (proves no cross-namespace leakage)

Rename the diagram/classification files to match Student ID-ShopSphere before zipping/pushing, per the project naming convention.
